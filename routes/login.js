var express = require('express');
const Login = require('../controllers/usersLogin');

var router = express.Router();

router.get('/',Login.loginGetHandling);

router.post('/',Login.loginUserHandling);

module.exports = router;
