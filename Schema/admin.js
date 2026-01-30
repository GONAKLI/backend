let mongoose = require('mongoose');

let admin = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, index: true },
  mobile: { type: Number, required: true, index: true },
  password: { type: String, required: true },
});

exports.admin = mongoose.model('admin', admin, 'admin');