const mongoose = require('mongoose');

const waterIntakeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: [true, 'Amount is required'], min: [1, 'Amount must be at least 1 ml'], max: 5000 },
  // Calendar day as "YYYY-MM-DD" so "today" and filtering never suffer timezone drift
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/, index: true },
  time: { type: String, default: '', match: /^(\d{2}:\d{2})?$/ },
  note: { type: String, default: '', trim: true, maxlength: 200 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WaterIntake', waterIntakeSchema);
