const router = require('express').Router();
const auth   = require('../middleware/auth');
const { getMoods, getRecommendations } = require('../controllers/moodController');

router.get('/', getMoods);                  // public: get all moods
router.get('/recommend', auth, getRecommendations); // private: requires auth

module.exports = router;