const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 60 },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: { type: String, required: [true, 'Password is required'], minlength: 6 },
  age: { type: Number, min: 1, max: 120, default: null },
  weight: { type: Number, min: 1, max: 500, default: null },
  dailyWaterGoal: { type: Number, min: 500, max: 10000, default: 2000 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
