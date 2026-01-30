let express = require('express');

let TeacherRoutes = express.Router();
let TeacherController = require('../Controller/TeacherController');


TeacherRoutes.post('/teacher-login', TeacherController.TeacherSignIn);

module.exports = TeacherRoutes;