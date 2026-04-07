const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String }, // Optional if using only Spotify

  // 🔹 Spotify Specific Fields
  spotifyId:           { type: String },
  spotifyAccessToken:  { type: String },
  spotifyRefreshToken: { type: String },
  profileImage:        { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);