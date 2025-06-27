const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
   reportNo: String,
    date: String,
    bookingNo: String,
    registrationNo: String,
    prefix: String,
    name: String,
    testGroup: String,
    investigation: String,
    signatory: String,
    status: String,
});

module.exports = mongoose.model('Patient', patientSchema);
