let express = require('express');
let fs = require('fs');

let TeacherRoutes = express.Router();
let TeacherController = require('../Controller/TeacherController');

let multer = require("multer");
let folderName = "StudentImages";

if(!fs.existsSync(folderName)){
  fs.mkdirSync(folderName);
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "StudentImages/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let StoreFile = multer({ storage: storage }).single("studentImage");



TeacherRoutes.get ('/teacher/', TeacherController.ValidateTeacher);

TeacherRoutes.post('/teacher/Add-New-Student',StoreFile, TeacherController.AddStudent);

TeacherRoutes.post('/teacher/logout', TeacherController.Logout);

TeacherRoutes.get("/teacher/TeacherDetails", TeacherController.TeacherDetails);


TeacherRoutes.get("/teacher/getStudents", TeacherController.GetStudents);

module.exports = TeacherRoutes;