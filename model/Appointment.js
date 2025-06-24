const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
  department: String,
  scheduledDate: Date,
  status: { type: String, enum: ['Scheduled', 'Completed', 'Missed', 'Rescheduled'], default: 'Scheduled' },
  channel: { type: String, enum: ['SMS', 'Voice', 'WhatsApp'] },
  language: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  confirmed: { type: Boolean, default: false },
  rescheduleHistory: [{
    oldDate: Date,
    newDate: Date,
    rescheduledAt: Date
  }]
});
module.exports = mongoose.model('Appointment', AppointmentSchema);
