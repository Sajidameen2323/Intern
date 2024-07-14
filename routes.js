const express = require('express');
const User = require('./models/User');
const { getWeatherData } = require('./utils/weather');
const { getCityName } = require('./utils/geocoding');

const router = express.Router();

// Store user details
router.post('/users', async (req, res) => {
  try {
    const { email, latitude, longitude } = req.body;
    const cityName = await getCityName(latitude, longitude);
    const user = new User({
      email,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully', cityName });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user location
router.put('/users/:email/location', async (req, res) => {
  try {
    const { email } = req.params;
    const { latitude, longitude } = req.body;
    const cityName = await getCityName(latitude, longitude);
    await User.findOneAndUpdate(
      { email },
      {
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      }
    );
    res.json({ message: 'Location updated successfully', cityName });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's weather data for a given day
router.get('/users/:email/weather', async (req, res) => {
  try {
    const { email } = req.params;
    const { date } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const weatherData = user.weatherData.filter(
      (data) => data.date.toISOString().split('T')[0] === date
    );
    res.json({ weatherData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;