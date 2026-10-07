const WaterIntake = require('../models/WaterIntake');

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

const pad = (n) => String(n).padStart(2, '0');
const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const nowTimeStr = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

// The client sends its own local date (?date=YYYY-MM-DD) so "today" matches the user's timezone.
const resolveToday = (req) => (dateRegex.test(req.query.date || '') ? req.query.date : toDateStr(new Date()));

const sumAmount = (records) => records.reduce((s, r) => s + r.amount, 0);

const validateBody = ({ amount, date, time }, partial = false) => {
  if (!partial || amount !== undefined) {
    const n = Number(amount);
    if (!n || n < 1 || n > 5000) return 'Amount must be between 1 and 5000 ml';
  }
  if (date !== undefined && !dateRegex.test(date)) return 'Date must be in YYYY-MM-DD format';
  if (time !== undefined && time !== '' && !timeRegex.test(time)) return 'Time must be in HH:MM format';
  return null;
};

// POST /api/water
exports.addWater = async (req, res, next) => {
  try {
    const error = validateBody(req.body);
    if (error) return res.status(400).json({ message: error });

    const now = new Date();
    const record = await WaterIntake.create({
      userId: req.user._id,
      amount: Number(req.body.amount),
      date: req.body.date || toDateStr(now),
      time: req.body.time || nowTimeStr(now),
      note: req.body.note || '',
    });
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

// GET /api/water/today?date=YYYY-MM-DD
exports.getToday = async (req, res, next) => {
  try {
    const today = resolveToday(req);
    const goal = req.user.dailyWaterGoal;

    const records = await WaterIntake.find({ userId: req.user._id, date: today }).sort({ time: -1, createdAt: -1 });
    const total = sumAmount(records);

    // Last 7 days (including today) for weekly stats
    const [y, m, d] = today.split('-').map(Number);
    const days = [];
    for (let i = 6; i >= 0; i--) days.push(toDateStr(new Date(y, m - 1, d - i)));

    const weekRecords = await WaterIntake.find({ userId: req.user._id, date: { $in: days } });
    const byDay = Object.fromEntries(days.map((day) => [day, 0]));
    weekRecords.forEach((r) => { byDay[r.date] += r.amount; });
    const weekly = days.map((day) => ({ date: day, total: byDay[day] }));
    const weekTotal = weekly.reduce((s, x) => s + x.total, 0);

    res.json({
      date: today,
      total,
      goal,
      remaining: Math.max(goal - total, 0),
      percentage: Math.min(Math.round((total / goal) * 100), 100),
      goalReached: total >= goal,
      records,
      weekly,
      stats: {
        weekTotal,
        weekAverage: Math.round(weekTotal / 7),
        daysGoalMet: weekly.filter((x) => x.total >= goal).length,
        entriesToday: records.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/water/history?date=YYYY-MM-DD  or  ?from=...&to=...
exports.getHistory = async (req, res, next) => {
  try {
    const { date, from, to } = req.query;
    const filter = { userId: req.user._id };

    if (date) {
      if (!dateRegex.test(date)) return res.status(400).json({ message: 'Invalid date filter' });
      filter.date = date;
    } else if (from || to) {
      if ((from && !dateRegex.test(from)) || (to && !dateRegex.test(to))) {
        return res.status(400).json({ message: 'Invalid date range' });
      }
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }

    const records = await WaterIntake.find(filter).sort({ date: -1, time: -1, createdAt: -1 }).limit(500);

    const dailyMap = {};
    records.forEach((r) => { dailyMap[r.date] = (dailyMap[r.date] || 0) + r.amount; });
    const daily = Object.entries(dailyMap).map(([day, total]) => ({ date: day, total }));

    res.json({ records, totalIntake: sumAmount(records), count: records.length, daily });
  } catch (err) {
    next(err);
  }
};

// PUT /api/water/:id
exports.updateWater = async (req, res, next) => {
  try {
    const error = validateBody(req.body, true);
    if (error) return res.status(400).json({ message: error });

    // userId in the query guarantees users can only touch their own records
    const record = await WaterIntake.findOne({ _id: req.params.id, userId: req.user._id });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    const { amount, date, time, note } = req.body;
    if (amount !== undefined) record.amount = Number(amount);
    if (date !== undefined) record.date = date;
    if (time !== undefined) record.time = time;
    if (note !== undefined) record.note = note;

    await record.save();
    res.json(record);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/water/:id
exports.deleteWater = async (req, res, next) => {
  try {
    const record = await WaterIntake.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted', id: record._id });
  } catch (err) {
    next(err);
  }
};
