const express = require('../node_modules/express');
const ejs = require('../node_modules/ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/', (req, res) => {

  const month = req.body.month;
  const year = req.body.year;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const month_num = months.indexOf(month) + 1;

  pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

    if (err) {
      connection.release();
      res.status(500).json({ status: "failed", reason: "connection to database not established." });
      console.log(err);
    }
    else {

      const query = `SELECT su.Name AS SchoolName, COUNT(*) AS TotalBorrowings
      FROM (
          SELECT b.IdUsers, s.IdSchool
          FROM Borrowing AS b
          JOIN Student AS s ON b.IdUsers = s.IdUsers
          JOIN Users AS u ON b.IdUsers = u.IdUsers
          WHERE YEAR(b.BorrowDate) = ?
              AND MONTH(b.BorrowDate) = ? AND u.Approved = 1
          UNION ALL
          SELECT b.IdUsers, t.IdSchool
          FROM Borrowing AS b
          JOIN Teacher AS t ON b.IdUsers = t.IdUsers
          JOIN Users AS u ON b.IdUsers = u.IdUsers
          WHERE YEAR(b.BorrowDate) = ?
              AND MONTH(b.BorrowDate) = ? AND u.Approved = 1
      ) AS borrowings
      JOIN SchoolUnit AS su ON borrowings.IdSchool = su.IdSchool
      GROUP BY su.Name;
      `;

      connection.query(query, [year, month_num, year, month_num], (error, results) => {
        if (error) {
          connection.release();
          console.error('Error fetching data from database:', error);
          res.sendStatus(500);
        } else {
          connection.release();              //release the connection so someone else can use it
          res.json(results);
        }
      });
    }
  });
});

module.exports = router;