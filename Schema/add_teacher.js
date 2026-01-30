// let mongoose = require("mongoose");

// let teacher_schema = new mongoose.Schema({
//   name: { type: String, required: true },
//   address: { type: String, required: true },
//   email: { type: String, required: true },
//   mobile: { type: Number, required: true },
//   dob: { type: String, required: true },
//   qualification: { type: String, required: true },
//   profilePic: { type: String, required: false },
//   admin_id: { type: String, required: true },
//   admin_email: { type: String, required: true },
// });

// exports.teacher = mongoose.model('teacher', teacher_schema, 'teachers');

const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, index: true },
  department: { type: String, required: true },
  mobile: { type: Number, required: true, index: true },
  dob: { type: String, required: true },
  qualification: { type: String, required: false },
  profilePic: { type: String },
  password: { type: String, required: true },
  admin_id: { type: String, required: true },
  admin_email: { type: String, required: true },
  admin_name: { type: String, required: true },
});

// 👇 Model name singular + Capitalized
const Teacher = mongoose.model("Teacher", teacherSchema, "teachers");

module.exports = Teacher;

