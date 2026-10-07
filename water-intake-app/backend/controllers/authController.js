const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const emailRegex = /^\S+@\S+\.\S+$/;

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  age: user.age,
  weight: user.weight,
  dailyWaterGoal: user.dailyWaterGoal,
  createdAt: user.createdAt,
});

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, dailyWaterGoal } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!email || !emailRegex.test(email)) return res.status(400).json({ message: 'A valid email is required' });
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email,
      password: hashed,
      ...(dailyWaterGoal ? { dailyWaterGoal: Number(dailyWaterGoal) } : {}),
    });

    res.status(201).json({ token: generateToken(user._id), user: userResponse(user) });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ token: generateToken(user._id), user: userResponse(user) });
  } catch (err) {
    next(err);
  }
};
