const fs = require('fs');
const u = require('./no_thumb_mayfair');
const axios = require('axios');
const cheerio = require('cheerio');
const { curly } = require('node-libcurl');

(async () => {
  for (let i = 10180; i < u.length; i++) {
    console.log(u.length, i, u[i]);
    try {
      // const { statusCode, data, } = await curly.get(u[i]);
      // if (statusCode === 200) {
      // }
      const { data } = await axios.get(u[i]);
      // console.log('data : ', data);

      if (data.match(/Your search returned no results./i) || data.match(/Search results for/i)) {
        const cmd = 'db.reference_product.updateMany({url:"' + u[i] + '"},{$set:{code:404, updatedBy:"LCC", updatedOn: new Date()}})\n';
        fs.appendFile('up_mf_404.txt', cmd, (err) => { if (err) throw err; });
      } else {
        const $ = cheerio.load(data);
        // let th = $('meta[property="og:image"]').attr('content');
        let th = $('.MagicZoom').attr('href');
        console.log('thumbnail : ', th);
        if (!th.match(/placeholder/i)) {
          const cmd = '"' + u[i] + '"\n';
          fs.appendFile('up_mf.txt', cmd, (err) => { if (err) throw err; });
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const cmd = 'db.reference_product.updateMany({url:"' + u[i] + '"},{$set:{code:404, updatedBy:"LCC", updatedOn: new Date()}})\n';
        // const cmd = 'db.reference_product.updateMany({url:"' + u[i] + '"},{$set:{code:404, updatedBy:"LCC", updatedOn: new Date()}})\n';
        fs.appendFile('up_mf_404.txt', cmd, (err) => { if (err) throw err; });
      } else console.log(err);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
})();