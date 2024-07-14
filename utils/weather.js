const axios = require('axios');

async function getWeatherData(lat, lon) {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await axios.get(url);
    return {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

module.exports = { getWeatherData };