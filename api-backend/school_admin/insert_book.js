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
                else {
                    var query = `
                        INSERT INTO Book (ISBN,Title,Publisher,PageNumber,Summary,Picture,Language,Rating)
                        VALUES ('${isbn}', '${title}', '${publisher}', '${numPages}', '${summary}', '${picture}', '${language}', '0');
                        `;

                    for (const writer of writersList) {
                        query += `INSERT INTO Book_Writers (ISBN, WriterName) VALUES ('${isbn}', '${writer}');`;
                    }

                    for (const keyword of keywordsList) {
                        query += `INSERT INTO Book_Keywords (ISBN, Keyword) VALUES ('${isbn}', '${keyword}');`;
                    }

                    for (const category of categoriesList) {
                        query += `INSERT INTO Book_Categories (ISBN, Category) VALUES ('${isbn}', '${category}');`;
                    }

                    query += `INSERT INTO Availability (ISBN, IdSchool, Copies, AvailableCopies, ReservedCopies) VALUES ('${isbn}', '${school_id}', '${copies}', '${copies}', 0);`

                    connection.query(query, (err, results) => {
                        if (err) {
                            console.error('Error Inserting Data:', err);
                            connection.rollback(() => {
                                connection.release();
                            });
                            if(err.sqlMessage.includes("CK_Copies")){
                                req.flash('error', 'Book Insertion Failed. Number of Copies must be higher than zero.');
                            }
                            else if(err.sqlMessage.includes("CK_ISBN")){
                                req.flash('error', 'Book Insertion Failed. The ISBN you provided is not valid.');
                            }
                            else if(err.sqlMessage.includes("CK_PAGENUMBER")){
                                req.flash('error', 'Book Insertion Failed. The Number of Pages you provided is not valid.');
                            }
                            else {
                                req.flash('error', 'Book Insertion Failed. Please check again your input');
                            }
                            res.redirect(`/libapp/school_admin/insert_book_page?school_id=${school_id}&user_id=${user_id}`);
                        }
                        else {
                            // Commit the transaction
                            connection.commit((err) => {
                                if (err) {
                                    console.error('Error committing transaction:', err);
                                    connection.rollback(() => {
                                        connection.release();
                                    });
                                    req.flash('error', 'Book Insertion Failed. Please check again your input');
                                    res.redirect(`/libapp/school_admin/insert_book_page?school_id=${school_id}&user_id=${user_id}`);
                                }

                                console.log('Transaction committed successfully.');
                                connection.release();
                                req.flash('success', 'Book Inserted Successful!');
                                res.redirect(`/libapp/school_admin/insert_book_page?school_id=${school_id}&user_id=${user_id}`);
                            });
                        }
                    });
                }


            });
        }
    });
});




module.exports = router;