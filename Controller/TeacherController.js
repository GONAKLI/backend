const Teacher = require("../Schema/add_teacher");

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
