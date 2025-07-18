const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const Plan = mongoose.model('PlanMaster', planSchema);
module.exports = Plan;
