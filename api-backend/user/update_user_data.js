const express = require('express');
const pool = require('../connect');
const router = express.Router();

router.post('/', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.Name;
    const addr_street = req.body.addr_street;
    const addr_number = req.body.addr_number;
    const addr_city = req.body.addr_city;
    const email = req.body.email;
    const birthDate = req.body.BirthDate;
    const phone_numbers = req.body.phone_numbers;

    let phoneNumbersList = [];

    if(phone_numbers){
        phoneNumbersList = phone_numbers.split(',').map(item => item.trim());
    }

    const user_id = req.body.user_id;
    const school_id = req.body.school_id;
    const teacher_str = req.body.teacher;

    var teacher;

    if (teacher_str === "true") {
        teacher = true;
    }
    else {
        teacher = false;
    }


    let query = "";

    if(teacher){

    if (username !== '' || password !== '') {
        query += 'UPDATE Users SET ';
    }

    let updates = [];

    if (username !== '') {
        updates.push(`Username = '${username}'`);
    }
    if (password !== '') {
        updates.push(`Password = '${password}'`);
    }


    if (username !== '' || password !== '') {
        query += updates.join(', ');
        query += `WHERE IdUsers = ${user_id};`;
    }

    if (name !== '' || addr_street !== '' || addr_number !== '' || addr_city !== '' || email !== '' || birthDate !== '') {
        query += 'UPDATE Teacher SET ';
    }

    updates = [];

    if (name !== '') {
        updates.push(`TeacherName = '${name}'`);
    }
    if (addr_street !== '') {
        updates.push(`Adress_street = '${addr_street}'`);
    }
    if (addr_number !== '') {
        updates.push(`Adress_number = '${addr_number}'`);
    }
    if (addr_city !== '') {
        updates.push(`Adress_city = '${addr_city}'`);
    }
    if (email !== '') {
        updates.push(`TeacherEmail = '${email}'`);
    }
    if (birthDate !== '') {
        updates.push(`BirthDate = '${birthDate}'`);
    }

    if (name !== '' || addr_street !== '' || addr_number !== '' || addr_city !== '' || email !== '' || birthDate !== '') {
        query += updates.join(', ');
        query += `WHERE IdUsers = ${user_id};`;
    }

    if (phone_numbers !== '') {
        query += `DELETE FROM TelephoneUser WHERE IdUsers = '${user_id}';`;
        for (const phone_number of phoneNumbersList) {
            query += `INSERT INTO TelephoneUser (IdUsers, PhoneNumber) VALUES ('${user_id}', '${phone_number}');`;
        }
    }
}
else{
    if (password !== '') {
        query += `UPDATE Users SET Password = '${password}' WHERE IdUsers = ${user_id};`;
    }
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
                    return;
                }

                connection.query(query, (err, results) => {
                    if (err) {
                        console.error('Error Updating Data:', err);
                        connection.rollback(() => {
                            connection.release();
                        });

                        const birthdateObj = new Date(birthDate);
                        const currentDate = new Date();
                        const age = currentDate.getFullYear() - birthdateObj.getFullYear();

                        if (err.sqlMessage.includes("Duplicate") && err.sqlMessage.includes("Username")) {
                            req.flash('error', 'Data Update Failed. Username provided already in use.');
                        }
                        else if (err.sqlMessage.includes("Duplicate") && err.sqlMessage.includes("Email")) {
                            req.flash('error', 'Data Update Failed. Email provided already in use.');
                        }
                        else if (err.sqlMessage.includes("CK_StudentEmail_Format") || err.sqlMessage.includes("CK_TeacherEmail_Format")) {
                            req.flash('error', 'Data Update Failed. Email provided is not valid.');
                        }
                        else if (teacher && (age < 25 || age > 67)) {
                            req.flash('error', 'Data Failed. Teachers can not be younger than 25 or older than 67 years old');
                        }
                        else if (!teacher && (age < 6 || age > 20)) {
                            req.flash('error', 'Data Creation Failed. Students can not be younger than 6 or older than 20 years old');
                        }
                        else {
                            req.flash('error', 'Data Update Failed. Please check again your input');
                        }
                        
                        res.redirect(`/libapp/user/user_data_page?school_id=${school_id}&user_id=${user_id}&teacher=${teacher}`);
                    }
                    else {
                        // Commit the transaction
                        connection.commit((err) => {
                            if (err) {
                                console.error('Error committing transaction:', err);
                                connection.rollback(() => {
                                    connection.release();
                                });
                                req.flash('error', 'Data Update Failed. Please check again your input');
                                res.redirect(`/libapp/user/user_data_page?school_id=${school_id}&user_id=${user_id}&teacher=${teacher}`);
                            }

                            console.log('Transaction committed successfully.');
                            connection.release();
                            req.flash('success', 'Data Updated Successfully!');
                            res.redirect(`/libapp/user/user_data_page?school_id=${school_id}&user_id=${user_id}&teacher=${teacher}`);
                        });
                    }
                });
            });
        }
    });
});




module.exports = router;