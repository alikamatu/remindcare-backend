const SubscriptionSchema = new mongoose.Schema({
  tierName: String, // e.g., "Basic", "Standard", "Enterprise"
  maxPatients: Number,
  monthlyPrice: Number,
  billingCycle: { type: String, enum: ['Monthly', 'Yearly'], default: 'Monthly' },
  active: { type: Boolean, default: true },
  startedAt: Date,
  endsAt: Date,
  facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Facility' }],
  lastBilledAt: Date,
  nextBillingDate: Date,
  billingHistory: [{
    invoiceId: String,
    amount: Number,
    status: { type: String, enum: ['Paid', 'Failed', 'Pending'] },
    billedAt: Date,
    paidAt: Date
  }]
});
module.exports = mongoose.model('Subscription', SubscriptionSchema);
