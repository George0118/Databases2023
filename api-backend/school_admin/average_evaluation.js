const express = require('express');
const ejs = require('ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {

  const school_id = req.query.school_id;
  const user_id = req.query.user_id;

  pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

    if (err) {
      connection.release();
      res.status(500).json({ status: "failed", reason: "connection to database not established." });
      console.log(err);
    }
    else {
      q = `SELECT
            BC.Category,
            AVG(R.RatingLikert) AS AverageEvaluation,
            CASE
              WHEN S.StudentName IS NOT NULL THEN S.StudentName
              WHEN T.TeacherName IS NOT NULL THEN T.TeacherName
              ELSE 'Unknown'
            END AS PersonName,
            U.IdUsers
          FROM
            Book_Categories BC
          LEFT JOIN
            Book B ON BC.ISBN = B.ISBN
          LEFT JOIN
            Review R ON B.ISBN = R.ISBN
          LEFT JOIN
            Users U ON R.IdUsers = U.IdUsers
          LEFT JOIN
            Student S ON U.IdUsers = S.IdUsers
          LEFT JOIN
            Teacher T ON U.IdUsers = T.IdUsers
          WHERE
            (S.IdSchool = ${school_id} OR T.IdSchool = ${school_id})
            AND (
              (S.StudentName IS NOT NULL AND S.StudentName != 'Unknown')
              OR (T.TeacherName IS NOT NULL AND T.TeacherName != 'Unknown')
            ) AND U.Approved = 1
          GROUP BY
            BC.Category,
            PersonName,
            U.IdUsers;                             
            `;
      connection.query(q, function (err, result) {
        if (err) {
          connection.release();
          res.status(400).json({ status: "failed", reason: "Error executing query." });
          console.log(err);
        }
        else {
          const average_evaluations = [];
          for (const row of result) {
            average_evaluations.push(row);
          }

          const filePath = "../frontend/views/school_admin/average_evaluation.ejs";
          fs.readFile(filePath, 'utf8', function (err, html) {
            if (err) {
              connection.release();
              console.error('Error reading HTML file:', err);
              res.status(500).send('Internal Server Error');
            } else {
              connection.release();              //release the connection so someone else can use it
              const renderedHtml = ejs.render(html, { user_id, school_id, average_evaluations: average_evaluations });
              res.send(renderedHtml);
            }

          });
        }
      });

    }
  });
});


module.exports = router;
