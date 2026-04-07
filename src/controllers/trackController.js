const SavedTrack = require('../models/SavedTrack');

exports.saveTrack = async (req, res) => {
  try {
    const track = await SavedTrack.create({ ...req.body, userId: req.user.id });
    res.status(201).json(track);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Track already saved' });
    res.status(400).json({ error: err.message });
  }
};

exports.getSavedTracks = async (req, res) => {
  const tracks = await SavedTrack.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(tracks);
};

exports.deleteTrack = async (req, res) => {
  await SavedTrack.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Track removed' });
};