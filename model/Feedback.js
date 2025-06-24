const FeedbackSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  submittedAt: Date,
  rating: { type: Number, min: 1, max: 5 },
  comments: String
});
module.exports = mongoose.model('Feedback', FeedbackSchema);
