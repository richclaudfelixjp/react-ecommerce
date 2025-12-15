const axios = require('axios');

exports.handler = async (event, context) => {
  const API_URL = process.env.BACKEND_API_URL || 'http://3.106.69.208:8080';
  
  try {
    const response = await axios({
      method: event.httpMethod,
      url: `${API_URL}${event.path.replace('/.netlify/functions/api', '')}`,
      headers: {
        ...event.headers,
        host: new URL(API_URL).host
      },
      data: event.body ? JSON.parse(event.body) : undefined
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify(error.response?.data || { message: 'Internal server error' })
    };
  }
};