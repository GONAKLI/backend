let mongoose = require('mongoose');

let Add_New_Student = mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  StudentImage: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  parentContact: { type: Number, required: true },
  rollNumber: { type: Number, required: true },
  department: { type: String, required: true },
  TeacherId: { type: String, required: true },
  TeacherName: { type: String, required: true },

  AdminId: { type: String, required: true },
});

const Student = mongoose.model("Students", Add_New_Student, "Students");

module.exports = Student;