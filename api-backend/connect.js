const mysql_db = require('mysql');
require('dotenv').config();

const connect = mysql_db.createPool({			//create a pool of connections to the database
	connectionLimit: 0,				// for the database to run we need host: 127.0.0.1 / user: root / password: (empty)
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: 'mydb',
	port: '3306',
	multipleStatements: true,
	dest: "../database/backup"
});

module.exports = connect;
