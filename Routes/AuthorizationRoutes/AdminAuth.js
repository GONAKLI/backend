let express = require('express');
let AdminAuthCheck = express.Router();
let AdminController = require('../../Controller/AdminController');

AdminAuthCheck.post("/admin_signup", AdminController.SignUp);

AdminAuthCheck.post("/admin_signin", AdminController.SignIn);

module.exports = AdminAuthCheck