const express = require('express');
const pool = require('./connect');
const router = express.Router();

router.post('/', function (req, res) {
    const { username, password, email, name, birthdate, telephone, street, addressNumber, city, school, role } = req.body;

    let phoneNumbersList = telephone.split(',').map(item => item.trim());

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
                        INSERT INTO Users (Username, Password, Approved) VALUES ('${username}', '${password}', '0');
                        SET @userId = LAST_INSERT_ID();
                        `;
                connection.query(query, (err, results) => {
                    if (err) {
                        console.error('Error Inserting Data:', err);
                        connection.rollback(() => {
                            connection.release();
                        });
                        req.flash('error', 'Account Creation Failed. Username already in use');
                        res.redirect('/libapp/sign_up_page');
                    }
                    else {
                        if (role == "student") {
                            query = `INSERT INTO Student (IdUsers, StudentName, Adress_street, Adress_number,
                                    Adress_city, StudentEmail, Birthdate, BooksToBorrow, BooksToReserve, IdSchool) 
                                    VALUES (@userId, '${name}', '${street}', '${addressNumber}', '${city}', 
                                    '${email}', '${birthdate}', '2', '2', (SELECT IdSchool FROM SchoolUnit WHERE Name = '${school}' LIMIT 1));`;
                        }
                        else if (role == "teacher") {
                            query = `INSERT INTO Teacher (IdUsers, TeacherName, Adress_street, Adress_number,
                                    Adress_city, TeacherEmail, Birthdate, BooksToBorrow, BooksToReserve, IdSchool) 
                                    VALUES (@userId, '${name}', '${street}', '${addressNumber}', '${city}', 
                                    '${email}', '${birthdate}', '1', '1', (SELECT IdSchool FROM SchoolUnit WHERE Name = '${school}' LIMIT 1));`
                        }
                        else {
                            query = `INSERT INTO SchoolAdmin (IdUsers, IdSchool, Name) 
                                VALUES (@userId, (SELECT IdSchool FROM SchoolUnit WHERE Name = '${school}' LIMIT 1), '${name}');`
                        }

                        connection.query(query, (err, results) => {
                            if (err) {
                                console.error('Error Inserting Data:', err);
                                connection.rollback(() => {
                                    connection.release();
                                });
                                const birthdateObj = new Date(birthdate);
                                const currentDate = new Date();
                                const age = currentDate.getFullYear() - birthdateObj.getFullYear();

                                if(role == "teacher" && (age < 25 || age > 67)) {
                                    req.flash('error', 'Account Creation Failed. Teachers can not be younger than 25 or older than 67 years old');
                                }
                                else if(role == "student" && (age < 6 || age > 20)) {
                                    req.flash('error', 'Account Creation Failed. Students can not be younger than 6 or older than 20 years old');
                                }
                                else {
                                    req.flash('error', 'Account Creation Failed. Email already in use');
                                }
                                
                                res.redirect('/libapp/sign_up_page');
                            }
                            else {
                                query = "";
                                for (const phone_number of phoneNumbersList) {
                                    query += `INSERT INTO TelephoneUser (IdUsers, PhoneNumber) VALUES (@userId, '${phone_number}');`;
                                }

                                connection.query(query, (err, results) => {
                                    if (err) {
                                        console.error('Error Inserting Data:', err);
                                        connection.rollback(() => {
                                            connection.release();
                                        });
                                        req.flash('error', 'Account Creation Failed. One of the phone numbers is already in use');
                                        res.redirect('/libapp/sign_up_page');
                                    }
                                    else {
                                        // Commit the transaction
                                        connection.commit((err) => {
                                            if (err) {
                                                console.error('Error committing transaction:', err);
                                                connection.rollback(() => {
                                                    connection.release();
                                                });
                                                req.flash('error', 'Account Creation Failed. Please check again your input');
                                                res.redirect('/libapp/sign_up_page');
                                            }
                                            else {
                                                console.log('Transaction committed successfully.');
                                                connection.release();
                                                req.flash('success', 'Sign Up Successful!');
                                                res.redirect('/libapp/login_page');
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });



            });
        }
    });
});




module.exports = router;