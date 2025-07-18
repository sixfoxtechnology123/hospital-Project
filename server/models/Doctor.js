const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  degree: { type: String },
  department: { type: String },
});

const Doctor = mongoose.model('DoctorMaster', doctorSchema);
module.exports = Doctor;
