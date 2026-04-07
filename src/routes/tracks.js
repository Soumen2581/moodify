const router = require('express').Router();
const auth   = require('../middleware/auth');
const { saveTrack, getSavedTracks, deleteTrack } = require('../controllers/trackController');
router.use(auth);
router.post('/',          saveTrack);
router.get('/',           getSavedTracks);
router.delete('/:id',     deleteTrack);
module.exports = router;