var express = require('express');

const Register = require('../controllers/usersRegister')

var router = express.Router();

// Get register page.
// If user registering, redirect to password page.
router.get('/', Register.registerGetHandling);

// User validation existence in the database.
router.get('/validation',Register.isUserExisted);

// Post the user firsts input data.
router.post('/',Register.storeInitialRegistrationInfo);

// Get password page.
router.get('/password',Register.checkStartedRegistration);

// Post user password.
router.post('/password',Register.handlePasswordRegistration);

module.exports = router;