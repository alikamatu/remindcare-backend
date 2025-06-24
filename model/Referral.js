const ReferralSchema = new mongoose.Schema({
  fromFacility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
  toFacility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  reason: String,
  notes: String,
  referredAt: Date,
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
});
module.exports = mongoose.model('Referral', ReferralSchema);
