const u = require('./u_mayfair.js');
const axios = require('axios');

(async () => {
  for (let i = 0; i < u.length; i++) {
    try {
      const { data } = await axios.get(u[i]);
      const img = data.match(/<meta property="og:image" content="(.*)" \/><meta property="og:description"/ig);
      if (img) {
        if (!img.match(/placeholder/i)) console.log('thumbnail : ', img[0]);
      } console.log('no image : ', u[i]);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const cmd = 'db.reference_product.updateMany({url:"' + u[i] + '"},{$set:{code:404, updatedBy:"LCC", updatedOn: new Date()}})\n';
        fs.appendFile('mayfair_404.txt', cmd, (err) => { if (err) throw err; });
      } else console.log(error);
    }
  }
})();