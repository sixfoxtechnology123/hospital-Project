const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceCode: String,
  serviceCategory: String,
  unitPrice: Number,
  quantity: Number,
  discountPercent: Number,
  discountValue: Number,
  netAmount: Number
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  paymentType: String,
  paymentMode: String,
  amount: Number,
  cardNo: String,
  bank: String,
  cardValidDate: String
}, { _id: false });

const opSchema = new mongoose.Schema({
  mrNumber: String,
  opNumber: String,
  category: String,
  paymentType: String,
  department: String,
  dateTime: { type: Date },
  validTill: { type: Date },
  name: String,
  mobile: String,
  address: String,
  services: [serviceSchema],
  payments: [paymentSchema],
  grossTotal: Number,
  discountTotal: Number,
  netTotal: Number
}, { timestamps: true });

module.exports = mongoose.model('OpVisit', opSchema);
