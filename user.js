var express = require('express');
var router = express.Router();

//import controller
const User = require('../controller/user');

router.post('/register',User.register);
router.post('/login',User.login);

module.exports=router;


