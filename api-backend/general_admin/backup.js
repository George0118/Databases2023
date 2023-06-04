const express = require('../node_modules/express');
const router = express.Router();
const backup = require('../node_modules/node-mysql-backup');
const path = require('path');

router.get('/', (req, res) => {
  const user_id = req.query.user_id;

  const config = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'mydb',
    port: '3306',
    dest: '../database/backup/backup.sql',
  };

  backup(config, function (err) {
    if (err) {
      console.error('Backup failed:', err);
      req.flash('error', 'Backup Failed. Something went wrong...');
    } else {
      console.log('Backup completed successfully.');
      req.flash('success', 'Backup completed successfully!');
    }
    res.redirect(`/libapp/general_admin/starting_page?user_id=${user_id}`);
  });
});

module.exports = router;
