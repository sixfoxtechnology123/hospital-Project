const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number },
 });

const Package = mongoose.model('PackageMaster', packageSchema);
module.exports = Package;
