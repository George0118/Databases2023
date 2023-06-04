const express = require('express');
const pool = require('../connect');
const router = express.Router();

router.post('/', function (req, res) {
    const isbn = req.body.ISBN;
    const user_id = req.body.user_id;
    const rating = req.body.rating;
    const review_text = req.body.comment;
    const school_id = req.body.school_id;
    const teacher = req.body.teacher;

    function convertRatingToValue(rating) {
        switch (rating) {
            case 'very-bad':
                return 1;
            case 'bad':
                return 2;
            case 'average':
                return 3;
            case 'good':
                return 4;
            case 'very-good':
                return 5;
            default:
                return null; // Return null or handle the default case as per your requirements
        }
    }

    const rating_value = convertRatingToValue(rating);

    let query = `INSERT INTO Review (isbn, IdUsers, RatingLikert, ReviewText, Approval)
                VALUES (${isbn}, ${user_id}, ${rating_value}, '${review_text}', 0);`;

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

                connection.query(query, (err, results) => {
                    if (err) {
                        console.error('Error Inserting Data:', err);
                        connection.rollback(() => {
                            connection.release();
                        });
                        req.flash('error', 'Review Failed. Something went wrong...');
                        res.redirect(`/libapp/user/borrowings?user_id=${user_id}&school_id=${school_id}&teacher=${teacher}`);
                    }
                    else {
                        // Commit the transaction
                        connection.commit((err) => {
                            if (err) {
                                console.error('Error committing transaction:', err);
                                connection.rollback(() => {
                                    connection.release();
                                });
                                req.flash('error', 'Review Failed. Something went wrong...');
                                res.redirect(`/libapp/user/borrowings?user_id=${user_id}&school_id=${school_id}&teacher=${teacher}`);
                            }

                            console.log('Transaction committed successfully.');
                            connection.release();
                            req.flash('success', 'Review completed Successfully!');
                            res.redirect(`/libapp/user/borrowings?user_id=${user_id}&school_id=${school_id}&teacher=${teacher}`);
                        });
                    }
                });
            });
        }
    });
});




module.exports = router;