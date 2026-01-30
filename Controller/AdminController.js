let {admin} = require('../Schema/admin');
let Teacher = require('../Schema/add_teacher');
let bcrypt = require("bcryptjs");
let multer = require("multer");


exports.ValidateAdmin = (req, res, next) => {
  if (req.session && req.session.AdminLoggedIn) {
   return next();
  } else {
    return res.status(401).json({
        reason : "unauthorized",
    });
  }
};

exports.DashBoard = (req, res) => {
    res.json({
      message: `welcome ${req.session.AdminName}`,
    });
};

exports.SignUp = async (req, res) => {
  let { name, email, mobile, password, gender } = req.body;
  let hashed = await bcrypt.hash(password, 15);
  email = email.toLowerCase();
  let admin_data = new admin({
    name,
    email,
    mobile,
    password: hashed,
    gender,
  });
  admin_data.save().then(() => {
    res.status(200).json({
      request: "fullfilled",
    });
  });
};

exports.SignIn = async (req, res) => {
  let user;
  if (isNaN(req.body.email)) {
    user = await admin.findOne({
      email: req.body.email.toLowerCase(),
    });
  } else {
    user = await admin.findOne({
      mobile: Number(req.body.email),
    });
  }

  if (user) {
    let checker = await bcrypt.compare(req.body.password, user.password);

    if (checker) {
      req.session.AdminName = user.name.toString();
      req.session.AdminId = user._id.toString();
      req.session.AdminEmail = user.email.toString();
      req.session.AdminLoggedIn = true;

      res.json({
        reason: "user found",
        userid: user._id,
      });
    } else {
      res.json({
        email: user.email,
        reason: "incorrect password",
      });
    }
  } else {
    res.status(404).json({
      status: 404,
      reason: "user not found",
    });
  }
};

exports.LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({
        reason: `logout failed, ${err}`,
      });
    } else {
      res.clearCookie("connect.sid");
      res.status(200).json({
        reason: "sucessfully logout",
      });
    }
  });
};

exports.AddTeacher = (req, res) => {

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "TeacherImages/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// let StoreFile = multer({ storage: storage }).single("profilePic");


// StoreFile(req,res, (err) => {

  let {
    name,
    address,
    email,
    dob,
    mobile,
    qualification,
    gender,
    department,
  } = req.body;
  let profilePic = req.file.path;
  email = email.toLowerCase();
  mobile = Number(mobile);
  let year = new Date(dob).getFullYear();
  let password = `${mobile}@${year}`;
  let admin_id = req.session.AdminId;
  let admin_email = req.session.AdminEmail;
  let admin_name = req.session.AdminName;
  let teacher_data = new Teacher({
    name,
    address,
    password,
    department,
    email,
    dob,
    mobile,
    qualification,
    profilePic,
    admin_id,
    admin_email,
    admin_name,
    gender,
  });
  teacher_data
    .save()
    .then(() => {
      res.status(200).json({
        response: "teacher added sucessfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        response: "unable to add teacher",
      });
    });

// });

  
};

exports.GetTeachers = (req, res) => {
  Teacher.find({
    admin_id: req.session.AdminId,
    admin_email: req.session.AdminEmail,
  }).then((teacher) => {
    res.status(200).json(teacher);
  });
};

exports.RemoveTeacher = (req, res) => {
  Teacher.findByIdAndDelete(req.params.id).then(() => {
    Teacher.find().then((teacher) => {
      res.json(teacher);
    });
  });
};
