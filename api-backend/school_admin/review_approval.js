const express = require('../node_modules/express');
const ejs = require('../node_modules/ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('../node_modules/path');
const router = express.Router();

router.post('/', function (req, res) {
    const userId = req.body.userId;
    const school_id = req.body.school_id;
    const user_id = req.body.user_id;
    const ISBN = req.body.isbn;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            const q = `UPDATE mydb.Review
            SET Approval = 1
            WHERE IdUsers = ${userId} AND ISBN = ${ISBN};`;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    console.log(err);
                    req.flash('error', 'Approval Failed. Something went wrong...');
                    res.redirect(`/libapp/school_admin/activate_accounts?school_id=${school_id}&user_id=${user_id}`);
                }
                else {
                    connection.release();              //release the connection so someone else can use it
                    req.flash('success', 'User Approved!');
                    res.redirect(`/libapp/school_admin/activate_accounts?school_id=${school_id}&user_id=${user_id}`);
                }
            });

        }
    });
});




module.exports = router;
