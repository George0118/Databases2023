const express = require('express');
const ejs = require('ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/', function (req, res) {

    const ISBN = req.body.ISBN;
    const userID = req.body.userID;
    const school_id = req.body.school_id;
    const user_id = req.body.user_id;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            const query = `SELECT Borrowing.*, 
                    CASE
                        WHEN Student.IdUsers IS NOT NULL THEN Student.StudentName
                        WHEN Teacher.IdUsers IS NOT NULL THEN Teacher.TeacherName
                        ELSE 'Unknown'
                    END AS Name,
                    Borrowing.IdUsers,
                    DATEDIFF(CURRENT_DATE, DATE_ADD(Borrowing.BorrowDate, INTERVAL 1 WEEK)) AS Deficit
                FROM Borrowing
                LEFT JOIN Users ON Borrowing.IdUsers = Users.IdUsers
                LEFT JOIN Student ON Users.IdUsers = Student.IdUsers AND Student.IdSchool = ${school_id}
                LEFT JOIN Teacher ON Users.IdUsers = Teacher.IdUsers AND Teacher.IdSchool = ${school_id}
                WHERE (Borrowing.Returned = 0 AND Borrowing.BorrowDate < DATE_SUB(CURRENT_DATE, INTERVAL 1 WEEK))
                AND ((CASE
                    WHEN Student.IdUsers IS NOT NULL THEN Student.StudentName
                    WHEN Teacher.IdUsers IS NOT NULL THEN Teacher.TeacherName
                    ELSE 'Unknown'
                END) <> 'Unknown');`;

            connection.query(query, function (err, due_borrowings) {

                if (err) {
                    console.log(err);
                    connection.release();              //release the connection so someone else can use it
                    req.flash('error', 'Borrowing Failed. Something went wrong...');
                    res.redirect(`/libapp/school_admin/borrow_without_reservation?school_id=${school_id}&user_id=${user_id}`);
                }
                else {

                    const due_borrowers = [];
                    for (borrowing in due_borrowings) {
                        due_borrowers.push(borrowing.IdUsers);
                    }

                    if (due_borrowers.includes(userID)) {
                        connection.release();              //release the connection so someone else can use it
                        req.flash('error', 'Borrowing Failed. User has not returned a due book...');
                        res.redirect(`/libapp/school_admin/borrow_without_reservation?school_id=${school_id}&user_id=${user_id}`);
                    }

                    const query = `INSERT INTO Borrowing (isbn, IdUsers, BorrowDate, Returned, Approved)
                    VALUES ('${ISBN}', '${userID}', CURDATE(), '0', '1');
                    `;

                    connection.query(query, function (err, result) {
                        if (err) {
                            console.log(err);
                            connection.release();              //release the connection so someone else can use it
                            if(err.sqlMessage.includes("CK_BooksToBorrow")){
                                req.flash('error', 'Borrowing Failed. User can not borrow any more books this week.');
                            }
                            else if(err.sqlMessage.includes("CK_AvailableCopies")){
                                req.flash('error', 'Borrowing Failed. There are no more available non reserved copies...');
                            }
                            else {
                                req.flash('error', 'Borrowing Failed. Something went wrong...');
                            }
                            
                            res.redirect(`/libapp/school_admin/borrow_without_reservation?school_id=${school_id}&user_id=${user_id}`);
                        }
                        else {
                            connection.release();              //release the connection so someone else can use it
                            req.flash('success', 'Borrowing completed Successfully!');
                            res.redirect(`/libapp/school_admin/borrow_without_reservation?school_id=${school_id}&user_id=${user_id}`);
                        }
                    });
                }
            });

        }
    });
});




module.exports = router;
