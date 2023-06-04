const express = require('express');
const pool = require('../connect');
const router = express.Router();

router.post('/', function (req, res) {
    const borrowingID = req.body.borrowingID;
    const school_id = req.body.school_id;
    const user_id = req.body.user_id;

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
                    return;
                }

                var query = `
                        UPDATE Borrowing
                        SET Returned = 1
                        WHERE BorrowingID = '${borrowingID}';
                        `;

                connection.query(query, (err, results) => {
                    if (err) {
                        console.error('Error Inserting Data:', err);
                        connection.rollback(() => {
                            connection.release();
                        });
                        req.flash('error', 'Book Return Failed. Something went wrong...');
                        res.redirect(`/libapp/school_admin/book_return_page?school_id=${school_id}&user_id=${user_id}`);
                    }
                    else {
                        // Commit the transaction
                        connection.commit((err) => {
                            if (err) {
                                console.error('Error committing transaction:', err);
                                connection.rollback(() => {
                                    connection.release();
                                });
                                req.flash('error', 'Book Return Failed. Something went wrong...');
                                res.redirect(`/libapp/school_admin/book_return_page?school_id=${school_id}&user_id=${user_id}`);
                            }

                            console.log('Transaction committed successfully.');
                            connection.release();
                            req.flash('success', 'Book Returned Successful!');
                            res.redirect(`/libapp/school_admin/book_return_page?school_id=${school_id}&user_id=${user_id}`);
                        });
                    }
                });
            });
        }
    });
});




module.exports = router;