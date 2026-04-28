const router = require('express').Router();
const { getMoods, getRecommendations } = require('../controllers/moodController');

router.get('/', getMoods);
router.get('/recommend', getRecommendations);

module.exports = router;