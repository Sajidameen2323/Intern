const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateWeatherDescription(weatherData, cityName) {
  try {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Generate a short weather report for ${cityName} with the following data: Temperature: ${weatherData.temperature}°C, Description: ${weatherData.description}.`,
      max_tokens: 100,
    });

    return response.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating weather description:', error);
    return `The current temperature in ${cityName} is ${weatherData.temperature}°C with ${weatherData.description}.`;
  }
}

module.exports = { generateWeatherDescription };