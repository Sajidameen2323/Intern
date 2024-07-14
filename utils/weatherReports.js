const nodemailer = require('nodemailer');
const User = require('../models/User');
const { getWeatherData } = require('./weather');
const { getCityName } = require('./geocoding');
const { generateWeatherDescription } = require('./openai');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendWeatherReports() {
  try {
    const users = await User.find();
    for (const user of users) {
      const [longitude, latitude] = user.location.coordinates;
      const cityName = await getCityName(latitude, longitude);
      const weatherData = await getWeatherData(latitude, longitude);
      const description = await generateWeatherDescription(weatherData, cityName);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Weather Report for ${cityName}`,
        text: description,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Weather report sent to ${user.email}`);

      // Save weather data to the user's document
      user.weatherData.push({
        date: new Date(),
        ...weatherData,
      });
      await user.save();
    }
  } catch (error) {
    console.error('Error sending weather reports:', error);
  }
}

module.exports = { sendWeatherReports };