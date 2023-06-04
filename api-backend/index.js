const path = require('path');
const express = require('express'),
    app = express(),
    router = express.Router();
const cors = require('cors');
const flash = require('express-flash');
const crypto = require('crypto');
const session = require('express-session');


const PORT = 9103;
const baseurl = '/libapp';

// API WEB SERVER

app.listen(PORT, () => {								                        //rest api listening to port 9103 and
    console.log(`App listening at: http://localhost:${PORT}${baseurl}`);		//creating url to access endpoints from
});

app.get(baseurl, function (req, res) {
    res.send('LibAPP is APP!');
});

// MIDDLEWARE FOR CROSS-ORIGIN REQUESTS
app.use(cors());

app.use(express.urlencoded({ extended: true }));

const secretKey = crypto.randomBytes(64).toString('hex');

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
  }));

app.use(flash());

const login_page = require('./login_page');					//set from where to get each endpoint
const login = require('./login');
const sign_up_page = require('./sign_up_page');
const sign_up = require('./sign_up');

const general_admin_starting_page = require('./general_admin/starting_page');
const general_admin_admins = require('./general_admin/admins');
const general_admin_admin_approval = require('./general_admin/admin_approval');
const general_admin_backup = require('./general_admin/backup');
const general_admin_restore = require('./general_admin/restore');
const general_admin_first_query = require('./general_admin/first_query');
const general_admin_first_query_search = require('./general_admin/first_query_search');
const general_admin_second_query = require('./general_admin/second_query');
const general_admin_second_query_search = require('./general_admin/second_query_search');
const general_admin_third_query = require('./general_admin/third_query');
const general_admin_fourth_query = require('./general_admin/fourth_query');
const general_admin_fifth_query = require('./general_admin/fifth_query');
const general_admin_sixth_query = require('./general_admin/sixth_query');
const general_admin_seventh_query = require('./general_admin/seventh_query');

const school_admin_starting_page = require('./school_admin/starting_page');
const school_admin_insert_book_page = require('./school_admin/insert_book_page');
const school_admin_insert_book = require('./school_admin/insert_book');
const school_admin_update_book_page = require('./school_admin/update_book_page');
const school_admin_update_book = require('./school_admin/update_book');
const school_admin_reservations = require('./school_admin/reservations');
const school_admin_reservation_borrow = require('./school_admin/borrow_with_reservation');
const school_admin_borrowings = require('./school_admin/borrowings');
const school_admin_due_borrowings = require('./school_admin/due_borrowings');
const school_admin_return_book_page = require('./school_admin/book_return_page');
const school_admin_return_book = require('./school_admin/return');
const school_admin_average_evaluation = require('./school_admin/average_evaluation');
const school_admin_borrow_without_resevation_page = require('./school_admin/borrow_without_reservation');
const school_admin_borrow_without_resevation = require('./school_admin/borrow');
const school_admin_books = require('./school_admin/books');
const school_admin_activate_accounts = require('./school_admin/activate_accounts_page');
const school_admin_activate_accounts_approve = require('./school_admin/approve');
const school_admin_deactivate_accounts = require('./school_admin/deactivate_accounts_page');
const school_admin_deactivate_accounts_deactivate = require('./school_admin/deactivate');
const school_admin_delete_accounts = require('./school_admin/delete_accounts_page');
const school_admin_delete_accounts_delete = require('./school_admin/delete');
const school_admin_approve_reviews_page = require('./school_admin/approve_reviews_page');
const school_admin_review_approval = require('./school_admin/review_approval');

const user_starting_page = require('./user/starting_page');
const user_data_page = require('./user/user_data_page');
const user_data_update = require('./user/update_user_data');
const user_books = require('./user/books');
const user_books_reserve = require('./user/reserve');
const user_borrowings = require('./user/borrowings');
const user_review = require('./user/review');
const user_commit_review = require('./user/commit_review');
const user_reservations = require('./user/reservations');
const user_reservations_cancel = require('./user/cancel');

// RESTFUL API ROUTES
app.use(baseurl + '/login_page', login_page);			 //and set the paths from the base url we created before
app.use(baseurl + '/login_page/login', login);
app.use(baseurl + '/sign_up_page', sign_up_page);               // to access the endpoints through the url
app.use(baseurl + '/sign_up', sign_up);

app.use(baseurl + '/general_admin/starting_page', general_admin_starting_page);
app.use(baseurl + '/general_admin/admins', general_admin_admins);
app.use(baseurl + '/general_admin/admins/approve', general_admin_admin_approval);
app.use(baseurl + '/general_admin/backup', general_admin_backup);
app.use(baseurl + '/general_admin/restore', general_admin_restore);
app.use(baseurl + '/general_admin/first_query', general_admin_first_query);
app.use(baseurl + '/general_admin/first_query_search', general_admin_first_query_search);
app.use(baseurl + '/general_admin/second_query', general_admin_second_query);
app.use(baseurl + '/general_admin/second_query_search', general_admin_second_query_search);
app.use(baseurl + '/general_admin/third_query', general_admin_third_query);
app.use(baseurl + '/general_admin/fourth_query', general_admin_fourth_query);
app.use(baseurl + '/general_admin/fifth_query', general_admin_fifth_query);
app.use(baseurl + '/general_admin/sixth_query', general_admin_sixth_query);
app.use(baseurl + '/general_admin/seventh_query', general_admin_seventh_query);

app.use(baseurl + '/school_admin/starting_page', school_admin_starting_page);
app.use(baseurl + '/school_admin/insert_book_page', school_admin_insert_book_page);
app.use(baseurl + '/school_admin/insert_book_page/insert', school_admin_insert_book);
app.use(baseurl + '/school_admin/update_book_page', school_admin_update_book_page);
app.use(baseurl + '/school_admin/update_book_page/update', school_admin_update_book);
app.use(baseurl + '/school_admin/reservations', school_admin_reservations);
app.use(baseurl + '/school_admin/reservations/borrow', school_admin_reservation_borrow);
app.use(baseurl + '/school_admin/borrowings', school_admin_borrowings);
app.use(baseurl + '/school_admin/due_borrowings', school_admin_due_borrowings);
app.use(baseurl + '/school_admin/book_return_page', school_admin_return_book_page);
app.use(baseurl + '/school_admin/book_return_page/return', school_admin_return_book);
app.use(baseurl + '/school_admin/average_evaluation', school_admin_average_evaluation);
app.use(baseurl + '/school_admin/borrow_without_reservation', school_admin_borrow_without_resevation_page);
app.use(baseurl + '/school_admin/borrow_without_reservation/borrow', school_admin_borrow_without_resevation);
app.use(baseurl + '/school_admin/books', school_admin_books);
app.use(baseurl + '/school_admin/activate_accounts', school_admin_activate_accounts);
app.use(baseurl + '/school_admin/activate_accounts/approve', school_admin_activate_accounts_approve);
app.use(baseurl + '/school_admin/deactivate_accounts', school_admin_deactivate_accounts);
app.use(baseurl + '/school_admin/deactivate_accounts/deactivate', school_admin_deactivate_accounts_deactivate);
app.use(baseurl + '/school_admin/delete_accounts', school_admin_delete_accounts);
app.use(baseurl + '/school_admin/delete_accounts/delete', school_admin_delete_accounts_delete);
app.use(baseurl + '/school_admin/approve_reviews', school_admin_approve_reviews_page);
app.use(baseurl + '/school_admin/approve_reviews/approve', school_admin_review_approval);

app.use(baseurl + '/user/starting_page', user_starting_page);
app.use(baseurl + '/user/user_data_page', user_data_page);
app.use(baseurl + '/user/user_data_page/update', user_data_update);
app.use(baseurl + '/user/books', user_books);
app.use(baseurl + '/user/books/reserve', user_books_reserve);
app.use(baseurl + '/user/borrowings', user_borrowings);
app.use(baseurl + '/user/borrowings/review', user_review);
app.use(baseurl + '/user/borrowings/review/commit', user_commit_review);
app.use(baseurl + '/user/reservations', user_reservations);
app.use(baseurl + '/user/reservations/cancel', user_reservations_cancel);


console.log(`Start exploring at: http://localhost:${PORT}${baseurl}/login_page`);

module.exports = router;