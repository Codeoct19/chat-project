import axios from "axios";
export const apiRequest = async (method, endpoint, data = null, token = null) => {

  try {
    const config = {
     method: method,
     url: process.env.REACT_APP_BASE_API_URL + endpoint,
    };

    // When get token so header
    if (token) { 
     const headers = {'Authorization': `Bearer ${token}`};
     config.headers = headers;
    } else {
    // When not get token so header 
      const headers = { 'Content-Type': 'application/json' };
      config.headers = headers;
    }

    // When POST method
    if (method !== 'GET' && data) { config.data = data; }
    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      return error;
    }    

  } catch (error) {
    console.error('Error:', error);
  }
};
