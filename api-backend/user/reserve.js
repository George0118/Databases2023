const express = require('express');
const pool = require('../connect');
const router = express.Router();

router.post('/', function (req, res) {
    const isbn = req.body.ISBN;
    const school_id = req.body.school_id;
    const teacher_str = req.body.teacher;
    const user_id = req.body.user_id;

    var teacher;
    if (teacher_str === "true") {
        teacher = true;
    }
    else {
        teacher = false;
    }

    var q;

    if (teacher) {
        q = `SELECT * FROM Teacher WHERE IdUsers = ${user_id}`;
    }
    else {
        q = `SELECT * FROM Student WHERE IdUsers = ${user_id}`;
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        } else {
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {

                    if (result[0].BooksToReserve == 0) {
                        connection.release();
                        req.flash('error', 'Reservation Failed. User can not reserve any more books this week.');
                        res.redirect(`/libapp/user/books?user_id=${user_id}&school_id=${school_id}&teacher=${teacher}`);
                    }
                    else {
                        let query = `INSERT INTO Reservation (ISBN, IdUsers, ReservationDate, Approved)
                VALUES (${isbn}, ${user_id}, CURDATE(), 1)`;

                        connection.query(query, (err, results) => {
                            if (err) {
                                console.error('Error Inserting Data:', err);
                                connection.release();
                                if (err.sqlMessage.includes("CK_BooksToReserve")) {
                                    req.flash('error', 'Reservation Failed. User can not reserve any more books this week.');
                                }
                                else if (err.sqlMessage.includes("CK_AvailableCopies")) {
                                    req.flash('error', 'Reservation Failed. There are no more available copies.');
                                }
                                else {
                                    req.flash('error', 'Reservation Failed. Something went wrong...');
                                }
                                res.redirect(`/libapp/user/books?user_id=${user_id}&school_id=${school_id}&teacher=${teacher}`);
                            }
                            else {
                                connection.release();
                                req.flash('success', 'Reservation completed Successfully!');
                                res.redirect(`/libapp/user/books?user_id=${user_id}&school_id=${school_id}&teacher=${teacher}`);
                            }
                        });
                    }
                }
            });
        }
    });
});




module.exports = router;