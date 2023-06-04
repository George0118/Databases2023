const express = require('express');
const pool = require('../connect');
const router = express.Router();

router.post('/', function (req, res) {

    const isbn = req.body.isbn;
    const title = req.body.title;
    const publisher = req.body.publisher;
    const numPages = req.body.numPages;
    const summary = req.body.summary;
    const picture = req.body.picture;
    const language = req.body.language;
    const categoriesList = req.body.Categories;
    const keywords = req.body.keywords;
    const writers = req.body.writers;
    const copies = req.body.copies;
    const school_id = req.body.school_id;
    const user_id = req.body.user_id;

    let writersList = writers.split(',').map(item => item.trim());
    let keywordsList = keywords.split(',').map(item => item.trim());

    let query = "";

    if (title !== '' || publisher !== '' || numPages !== '' || summary !== '' || picture !== '' || language !== '') {
        query += 'UPDATE Book SET ';
    }
    let updates = [];

    if (title !== '') {
        updates.push(`title = '${title}'`);
    }
    if (publisher !== '') {
        updates.push(`publisher = '${publisher}'`);
    }
    if (numPages !== '') {
        updates.push(`PageNumber = '${numPages}'`);
    }
    if (summary !== '') {
        updates.push(`summary = '${summary}'`);
    }
    if (picture !== '') {
        updates.push(`picture = '${picture}'`);
    }
    if (language !== '') {
        updates.push(`language = '${language}'`);
    }


    if (title !== '' || publisher !== '' || numPages !== '' || summary !== '' || picture !== '' || language !== '') {
        query += updates.join(', ');
        query += `WHERE ISBN = ${isbn};`;
    }


    if (writers !== '') {
        query += `DELETE FROM Book_Writers WHERE isbn = '${isbn}';`;
        for (const writer of writersList) {
            query += `INSERT INTO Book_Writers (ISBN, WriterName) VALUES ('${isbn}', '${writer}');`;
        }
    }

    if (typeof categoriesList === undefined) {
        console.log("hi");
        query += `DELETE FROM Book_Categories WHERE isbn = '${isbn}';`;
        for (const category of categoriesList) {
            query += `INSERT INTO Book_Categories (ISBN, Category) VALUES ('${isbn}', '${category}');`;
        }
    }

    if (keywords !== '') {
        query += `DELETE FROM Book_Keywords WHERE isbn = '${isbn}';`;
        for (const keyword of keywordsList) {
            query += `INSERT INTO Book_Keywords (ISBN, Keyword) VALUES ('${isbn}', '${keyword}');`;
        }
    }

    if (copies !== '') {
        query += `UPDATE Availability
        SET AvailableCopies = ${copies} - (Copies - AvailableCopies), Copies = ${copies}
        WHERE ISBN = ${isbn} AND IdSchool = ${school_id};`;
    }

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
                    res.redirect(`/libapp/school_admin/update_book_page?school_id=${school_id}&user_id=${user_id}`);
                }
                else {
                    connection.query(query, (err, results) => {
                        if (err) {
                            console.error('Error Updating Data:', err);
                            connection.rollback(() => {
                                connection.release();
                            });
                            if (err.sqlMessage.includes("CK_AvailableCopies") || err.sqlMessage.includes("CK_ReservedCopies")) {
                                req.flash('error', 'Book Update Failed. New value of copies can not be less than the books already reserved plus already borrowed...');
                            } else {
                                req.flash('error', 'Book Update Failed. Something went wrong...');
                            }
                            req.flash('error', 'Book Update Failed. Please check again your input');
                            res.redirect(`/libapp/school_admin/update_book_page?school_id=${school_id}&user_id=${user_id}`);
                        }
                        else {
                            // Commit the transaction
                            connection.commit((err) => {
                                if (err) {
                                    console.error('Error committing transaction:', err);
                                    connection.rollback(() => {
                                        connection.release();
                                    });
                                    req.flash('error', 'Book Update Failed. Please check again your input');
                                    res.redirect(`/libapp/school_admin/update_book_page?school_id=${school_id}&user_id=${user_id}`);
                                }
                                else {
                                    console.log('Transaction committed successfully.');
                                    connection.release();
                                    req.flash('success', 'Book Updated Successfully!');
                                    res.redirect(`/libapp/school_admin/update_book_page?school_id=${school_id}&user_id=${user_id}`);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});




module.exports = router;