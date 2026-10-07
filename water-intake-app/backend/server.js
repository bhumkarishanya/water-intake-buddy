const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const waterRoutes = require('./routes/waterRoutes');
const { notFound, errorHandler } = require('./middleware/authMiddleware');

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error('Missing MONGO_URI or JWT_SECRET in .env');
  process.exit(1);
}

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Water Intake Tracker API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/water', waterRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
