const fs = require('fs');
const u = require('./no_thumb_ptime');
const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  for (let i = 2205; i < u.length; i++) {
    console.log(u.length, i);
    try {
      const { data } = await axios.get(u[i]);
      const $ = cheerio.load(data);
      let th = $('.MagicZoom ').attr('href');
      if (!th.match(/coming_soon/i)) {
        const cmd = '"' + u[i] + '"\n';
        fs.appendFile('up_wmax.txt', cmd, (err) => { if (err) throw err; });
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const cmd = 'db.reference_product.updateMany({url:"' + u[i] + '"},{$set:{code:404, updatedBy:"LCC", updatedOn: new Date()}})\n';
        // const cmd = 'db.reference_product.updateMany({url:"' + u[i] + '"},{$set:{code:404, updatedBy:"LCC", updatedOn: new Date()}})\n';
        fs.appendFile('up_wmax_404.txt', cmd, (err) => { if (err) throw err; });
      } else console.log(err);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
})();