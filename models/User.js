const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  date: Date,
  temperature: Number,
  description: String,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  weatherData: [weatherDataSchema],
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);