const express = require('../node_modules/express');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
    const user_id = req.query.user_id;

    const connectionOptions = {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'mydb',
        multipleStatements: true
    };

    const connection = mysql.createConnection(connectionOptions);

    // Read the backup SQL file
    const backupFilePath = "../database/backup/backup.sql";
    const backupFile = fs.readFileSync(backupFilePath, 'utf8');
    const query = "SET FOREIGN_KEY_CHECKS = 0;" + backupFile + "SET FOREIGN_KEY_CHECKS = 1;"
    const statements = query.split(';');

    let executedStatements = 0;

    for (const statement of statements) {
        const sql = statement.trim();

        if (sql && !isDelimiterOrTriggerStatement(sql)) {
            connection.query(sql, (error, results) => {
                if (error) {
                    console.error('Error executing SQL statement:', error);
                    //console.log('Problematic SQL statement:', sql);
                } else {
                    //console.log('SQL statement executed successfully.');
                }

                executedStatements++;

                if (executedStatements === statements.length) {
                    // All statements executed, send the response
                    req.flash('success', 'Restored Successfully!');
                    res.redirect(`/libapp/general_admin/starting_page?user_id=${user_id}`);
                }
            });
        } else {
            executedStatements++;

            if (executedStatements === statements.length) {
                // All statements executed, send the response
                req.flash('success', 'Restored Successfully!');
                res.redirect(`/libapp/general_admin/starting_page?user_id=${user_id}`);
            }
        }
    }
});

function isDelimiterOrTriggerStatement(sql) {
    // Check if the SQL statement is a delimiter statement or CREATE TRIGGER statement
    const trimmedSql = sql.trim().toLowerCase();
    return trimmedSql.startsWith('delimiter') || trimmedSql.startsWith('create trigger');
}

module.exports = router;

