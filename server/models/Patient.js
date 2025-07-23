const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema({
  mrNumber: { type: String, unique: true },
  registrationDateTime: {
            type: String,
            default: () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })},
  prefix: String,
  name: String,
  fatherOrSpouse: String,
  age: String,
  sex: String,
  dob: String,
  maritalStatus: String,
  bloodGroup: String,
  address1: String,
  address2: String,
  location: String,
  city: String,
  pinCode: String,
  state: String,
  country: String,
  mobile: String,
  kinMobile: String,
  kinRelation: String,
  email: String,
  religion: String,
  occupation: String,
  abhaId: String,
  pan: String,
  aadhar: String,
  source: String,
});

module.exports = mongoose.model("Patient", patientSchema);
