let Express = require("express");
let AdminRouter = Express.Router();
let multer = require("multer");
let fs = require('fs');

let folderName = "TeacherImages";

if(!fs.existsSync(folderName)){
 fs.mkdirSync(folderName);
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "TeacherImages/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let StoreFile = multer({ storage: storage }).single("profilePic");


let AdminController = require("../Controller/AdminController");

AdminRouter.use('/admin/',AdminController.ValidateAdmin);

AdminRouter.get("/admin/dashboard", AdminController.DashBoard);

AdminRouter.post(
  "/admin/add-teacher",
  StoreFile,
  AdminController.AddTeacher,
);

AdminRouter.get("/admin/get-teachers", AdminController.GetTeachers);

AdminRouter.delete("/admin/delete-teacher/:id", AdminController.RemoveTeacher);

AdminRouter.post("/admin/logout", AdminController.LogOut);

AdminRouter.get("/admin/dashboard/view-students", AdminController.GetStudents);

AdminRouter.get("/admin/dashboard/view-student/:id", AdminController.GetOneStudent);

AdminRouter.delete('/admin/delete-student/:id', AdminController.RemoveStudent);

module.exports = AdminRouter;
