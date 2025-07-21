const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorCode: {
    type: String,
    required: true,
    unique: true
  },
  doctorName: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  departmentName: {
    type: String,
    required: true
  },

  registrationNo: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('DoctorMaster', doctorSchema);
