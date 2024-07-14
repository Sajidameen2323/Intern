const axios = require('axios');

async function getCityName(lat, lon) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
    
    const response = await axios.get(url);
    
    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const cityComponent = result.address_components.find(
        component => component.types.includes('locality')
      );
      
      return cityComponent ? cityComponent.long_name : 'Unknown';
    }
    
    return 'Unknown';
  } catch (error) {
    console.error('Error getting city name:', error);
    return 'Unknown';
  }
}

module.exports = { getCityName };