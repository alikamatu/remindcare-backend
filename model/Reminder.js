const ReminderSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  type: { type: String, enum: ['7-day', '3-day', '1-day', 'Feedback'] },
  sentAt: Date,
  channel: String,
  status: { type: String, enum: ['Pending', 'Sent', 'Failed'] },
  response: String
});
module.exports = mongoose.model('Reminder', ReminderSchema);
