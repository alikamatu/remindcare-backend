const FacilitySchema = new mongoose.Schema({
  name: String,
  location: String,
  departments: [String],
  sharedCalendarEnabled: Boolean,
  currentPatientCount: { type: Number, default: 0 },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }
});
module.exports = mongoose.model('Facility', FacilitySchema);
