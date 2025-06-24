const mongoose = require('mongoose');
const PatientSchema = new mongoose.Schema({
  fullName: String,
  gender: String,
  phoneNumber: String,
  hospitalNumber: String,
  language: String,
  location: String,
  chronicConditions: [String],
  facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' }
});
module.exports = mongoose.model('Patient', PatientSchema);
