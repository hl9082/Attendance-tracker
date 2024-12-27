const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  biometrics: { type: String, required: true }, // Store a hashed version of biometric data
});

module.exports = mongoose.model('User', UserSchema);
