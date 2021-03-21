const { curly } = require('node-libcurl');

(async () => {
  const { statusCode, data, headers } = await curly.get('http://www.google.com')
})();