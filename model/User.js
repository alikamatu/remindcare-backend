const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  role: { type: String, enum: ['Clerk', 'Doctor', 'Admin'] },
  facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }
});
module.exports = mongoose.model('User', UserSchema);
