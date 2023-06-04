const express = require('express');
const pool = require('../connect');
const router = express.Router();

router.post('/', function (req, res) {
    const reservationId = req.body.reservationId;
    const user_id = req.body.user_id;
    const school_id = req.body.school_id;
    const teacher = req.body.teacher;

    let query = `DELETE FROM Reservation WHERE ReservationID = ${reservationId}`;

    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        } else {
            connection.beginTransaction((err) => {
                if (err) {
                    console.error('Error starting transaction:', err);
                    connection.release();
                    req.flash('error', 'Cancelation Failed. Something went wrong...');
                    res.redirect(`/libapp/user/reservations?user_id=${user_id}&school_id=${school_id}&teacher=${teacher}`);
                }

                connection.query(query, (err, results) => {
                    if (err) {
                        console.error('Error Deleting Data:', err);
                        connection.rollback(() => {
                            connection.release();
                        });
                        req.flash('error', 'Cancelation Failed. Something went wrong...');
                        res.redirect(`/libapp/user/reservations?user_id=${user_id}&school_id=${school_id}&teacher=${teacher}`);
                    }
                    else {
                        // Commit the transaction
                        connection.commit((err) => {
                            if (err) {
                                console.error('Error committing transaction:', err);
                                connection.rollback(() => {
                                    connection.release();
                                });
                                req.flash('error', 'Cancelation Failed. Something went wrong...');
                                res.redirect(`/libapp/user/reservations?user_id=${user_id}&school_id=${school_id}&teacher=${teacher}`);
                            }

                            console.log('Transaction committed successfully.');
                            connection.release();
                            req.flash('success', 'Cancelation completed Successfully!');
                            res.redirect(`/libapp/user/reservations?user_id=${user_id}&school_id=${school_id}&teacher=${teacher}`);
                        });
                    }
                });
            });
        }
    });
});




module.exports = router;