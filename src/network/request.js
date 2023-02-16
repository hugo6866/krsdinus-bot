const axios = require('axios');

const sendHttpRequest = async (method, url, headers, data, allowRedirects = false) => {
  const options = {
    method,
    url,
    headers,
    data,
    withCredentials: true,
    maxRedirects: allowRedirects ? null : 0,
    redirect: allowRedirects ? 'follow' : 'manual',
    validateStatus: allowRedirects ? status => status >= 200 && status < 400 : null,
  };

  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    console.log('error', error);
  }
};


module.exports = { sendHttpRequest };
