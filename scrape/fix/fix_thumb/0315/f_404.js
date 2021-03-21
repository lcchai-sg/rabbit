const fs = require('fs');
const u = require('./no_thumb_mayfair');
const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  for (let i = 0; i < u.length; i++) {
    console.log(u.length, i);
    try {
      const { data } = await axios.get(u[i]);
      if (data.match(/Your search returned no results./i)) {
        const cmd = 'db.reference_product.updateMany({url:"' + u[i] + '"},{$set:{code:"not product", updatedBy:"LCC", updatedOn: new Date()}})\n';
        fs.appendFile('up_mf_404.txt', cmd, (err) => { if (err) throw err; });
      } else {
        console.log('data found...')
        const $ = cheerio.load(data);
        let th = $('meta[property="og:image"]').attr('content');
        if (!th.match(/placeholder/i)) {
          const cmd = '"' + u[i] + '"\n';
          fs.appendFile('up_mf.txt', cmd, (err) => { if (err) throw err; });
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const cmd = 'db.reference_product.updateMany({url:"' + u[i] + '"},{$set:{code:"not product", updatedBy:"LCC", updatedOn: new Date()}})\n';
        // const cmd = 'db.reference_product.updateMany({url:"' + u[i] + '"},{$set:{code:404, updatedBy:"LCC", updatedOn: new Date()}})\n';
        fs.appendFile('up_mf_404.txt', cmd, (err) => { if (err) throw err; });
      } else console.log(err);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
})();