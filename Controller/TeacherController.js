const Student = require("../Schema/Add_New_Student");
const Teacher = require("../Schema/add_teacher");

exports.ValidateTeacher = (req, res, next) => {
  if (req.session && req.session.TeacherloggedIn) {
     res.status(200).json({
       message: "Valid User",
     });
  } else {
    res.status(403).json({
      message: "Log In First",
    });
  }
};

exports.TeacherSignIn = async (req, res) => {
  let { email, password } = req.body;
  let teacher;
  if (isNaN(email)) {
    teacher = await Teacher.findOne({ email: email.toLowerCase() });
  } else {
    teacher = await Teacher.findOne({ mobile: Number(email) });
  }

  if (teacher && teacher.password === password) {
    req.session.TeacherName = teacher.name.toString();
    req.session.TeacherloggedIn = true;
    req.session.TeacherEmail = teacher.email.toString();
    req.session.TeacherId = teacher._id.toString();
    req.session.AdminId = teacher.admin_id.toString();

    return res.status(200).json({
      message: "teacher details are correct",
    });
  } else if (teacher && teacher.password !== password) {
    return res.status(502).json({
      message: "incorrect password",
    });
  } else {
    return res.status(404).json({
      message: "teacher not exists",
    });
  }
};



exports.AddStudent = (req, res) => {
  let {
    name,
    gender,
    fatherName,
    motherName,
    email,
    mobileNumber,
    parentContact,
    rollNumber,
    department,
  } = req.body;
  email = email.toLowerCase();
  mobileNumber = Number(mobileNumber);
  parentContact = Number(parentContact);
  rollNumber = Number(rollNumber);
  let TeacherId = req.session.TeacherId.toString();
  let TeacherName = req.session.TeacherName.toString();
  let StudentImage = req.file.path.toString();
  let AdminId = req.session.AdminId.toString();

  let StudentData = new Student({
    name,
    gender,
    fatherName,
    motherName,
    email,
    mobileNumber,
    parentContact,
    rollNumber,
    department,
    TeacherId,
    TeacherName,
    StudentImage,
    AdminId,
  });

  StudentData.save().then(()=>{
    
      return res.status(201).json({
        message: "Student Added Successfully"
      })

  }).catch(err =>{
    return res.status(500).json({
      message: "Unable To Save Data",
    });
  })

};

exports.Logout = (req,res) => {
 req.session.destroy((err) => {
   if (err) {
   return  res.status(500).json({
       reason: `logout failed, ${err}`,
     });
   } else {
     res.clearCookie("connect.sid");
     return res.status(200).json({
       reason: "sucessfully logout",
     });
   }
 });
}

exports.TeacherDetails = async(req,res) =>{
  let id = req.session.TeacherId;
 let TeacherInfo = await Teacher.findById(id);
 if(TeacherInfo){
 res.status(200).json(TeacherInfo);
 }

 
}


exports.GetStudents = async (req, res) => {
  try {
    let Students = await Student.find({ TeacherId: req.session.TeacherId });

    if (!Students || Students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    let Details = Students.map((stu) => ({
      studentId : stu._id.toString(),
      name: stu.name,
      StudentImage: stu.StudentImage,
      gender: stu.gender,
      fatherName: stu.fatherName,
      motherName: stu.motherName,
      email: stu.email,
      mobileNumber: stu.mobileNumber,
      parentContact: stu.parentContact,
      rollNumber: stu.rollNumber,
      department: stu.department,
    }));

    return res.status(200).json({ students: Details });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};