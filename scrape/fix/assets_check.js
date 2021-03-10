const axios = require('axios');
const u = require('./assets');

(async() => {
  for (let i=0; i<u.length; i++) {
    if (i % 500 === 0) console.log(u.length, i);
    const a = "https://synopsis.cosmos.ieplsg.com/files/"+u[i];
    try {
      const {data} = await axios.get(a);
    } catch (error) {
      if (error.response && error.response.status === 404)
        console.log('not found : ', a);
      else
        console.error(error);
    }
  }
  console.log();
  console.log('done.');
  process.exit(0);
})();