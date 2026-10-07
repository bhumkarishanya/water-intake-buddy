const User = require('../models/User');

const emailRegex = /^\S+@\S+\.\S+$/;

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, age, weight, dailyWaterGoal } = req.body;
    const user = await User.findById(req.user._id);

    if (name !== undefined) {
      if (!String(name).trim()) return res.status(400).json({ message: 'Name cannot be empty' });
      user.name = String(name).trim();
    }
    if (email !== undefined) {
      if (!emailRegex.test(email)) return res.status(400).json({ message: 'A valid email is required' });
      const taken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (taken) return res.status(409).json({ message: 'Email already in use' });
      user.email = email;
    }
    if (age !== undefined) user.age = age === '' || age === null ? null : Number(age);
    if (weight !== undefined) user.weight = weight === '' || weight === null ? null : Number(weight);
    if (dailyWaterGoal !== undefined) {
      const goal = Number(dailyWaterGoal);
      if (!goal || goal < 500 || goal > 10000) {
        return res.status(400).json({ message: 'Daily goal must be between 500 and 10000 ml' });
      }
      user.dailyWaterGoal = goal;
    }

    await user.save();
    const { password, ...safe } = user.toObject();
    res.json(safe);
  } catch (err) {
    next(err);
  }
};
