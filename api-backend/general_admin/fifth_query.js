const express = require('../node_modules/express');
const ejs = require('../node_modules/ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {

    const user_id = req.query.user_id;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            q = `DROP VIEW IF EXISTS Persons_Per_School_View;
            CREATE VIEW Persons_Per_School_View AS
            SELECT sa.IdUsers as IdSchoolAdmin, sa.Name as SchoolAdminName, s.IdSchool, 'Student' AS PersonType, st.IdUsers AS PersonId, st.StudentName AS PersonName, st.StudentEmail AS PersonEmail
            FROM Student st
            JOIN SchoolAdmin sa ON st.IdSchool = sa.IdSchool
            JOIN SchoolUnit s ON sa.IdSchool = s.IdSchool
            UNION ALL
            SELECT sa.IdUsers as IdSchoolAdmin, sa.Name as SchoolAdminName ,s.IdSchool, 'Teacher' AS PersonType, t.IdUsers AS PersonId, t.TeacherName AS PersonName, t.TeacherEmail AS PersonEmail
            FROM Teacher t
            JOIN SchoolAdmin sa ON t.IdSchool = sa.IdSchool
            JOIN SchoolUnit s ON sa.IdSchool = s.IdSchool;
            SELECT NumBorrowedBooks, GROUP_CONCAT(DISTINCT SchoolAdminName) AS SchoolAdminList
  FROM (
      SELECT YEAR(b.BorrowDate) AS Year, p.SchoolAdminName, COUNT(b.ISBN) AS NumBorrowedBooks
      FROM Persons_Per_School_View p
      JOIN Borrowing b ON p.PersonId = b.IdUsers
      JOIN Users ON b.IdUsers = Users.IdUsers
      WHERE Users.Approved = 1
      GROUP BY YEAR(b.BorrowDate), p.SchoolAdminName
  ) AS subquery
  WHERE NumBorrowedBooks > 20
  GROUP BY NumBorrowedBooks
  ORDER BY NumBorrowedBooks DESC;          
            `;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();              //release the connection so someone else can use it
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {

                    const filePath = "../frontend/views/general_admin/fifth_query.ejs";

                    const admins = [];
                    for (const row of result[2]) {
                        admins.push(row);
                    }
                      
                    connection.release();              //release the connection so someone else can use it
                    fs.readFile(filePath, 'utf8', function(err, html) {
                        if (err) {
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            const renderedHtml = ejs.render(html, { user_id, admins: admins });
                            res.send(renderedHtml);
                        }
                    });

                }
            });

        }
    });
});


module.exports = router;
