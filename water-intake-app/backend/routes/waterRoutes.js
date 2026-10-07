const express = require('express');
const {
  addWater, getToday, getHistory, updateWater, deleteWater,
} = require('../controllers/waterController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', addWater);
router.get('/today', getToday);
router.get('/history', getHistory);
router.route('/:id').put(updateWater).delete(deleteWater);

module.exports = router;
