const mongoose = require('mongoose');

const savedTrackSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  spotifyId: { type: String, required: true },
  name:      { type: String, required: true },
  artist:    { type: String, required: true },
  album:     { type: String },
  imageUrl:  { type: String },
  previewUrl:{ type: String },
  mood:      { type: String, required: true },
}, { timestamps: true });

// prevent duplicates per user
savedTrackSchema.index({ userId: 1, spotifyId: 1 }, { unique: true });

module.exports = mongoose.model('SavedTrack', savedTrackSchema);