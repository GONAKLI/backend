let express = require('express');
let TeacherAuthCheck = express.Router();
let TeacherController = require('../../Controller/TeacherController');

TeacherAuthCheck.post('/teacher-login', TeacherController.TeacherSignIn);

module.exports = TeacherAuthCheck;