const axios = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
// const u = require('./prod');         //done
const u = require('./no_assets_hamilton')
const prompt = require('prompt-sync')();
const fs = require('fs');

(async () => {
  let stop = ''; let upd = '';
  for (let i = 0; i < u.length && stop !== 'y'; i++) {
    try {
      // const { data } = await axios.get(u[i]);
      const cmdurl = 'open -a "Google Chrome" "' + u[i] + '"';
      await exec(cmdurl);
      await new Promise(r => setTimeout(r, 10000));
      // upd = prompt("not product ? ");
      // if (upd === 'y') {
      //   const cmd = `db.reference_product.updateMany({url: "${u[i]}"},{$set:{code:404}})\n`;
      //   fs.appendFile('up_prod.txt', cmd, (err) => { if (err) throw err; });
      // }
      // const cmd = "db.reference_product.updateMany({url: '" + u[i] + "'}, {$set:{code:404}})\n";
      // fs.appendFile('up_prod.txt', cmd, (err) => { if (err) throw err; });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // const cmd = "db.reference_product.updateMany({url: '" + u[i] + "'}, {$set:{code:404}})\n";
        const cmd = `db.reference_product.updateMany({url: "${u[i]}"},{$set:{code:404}})\n`;
        fs.appendFile('up_prod.txt', cmd, (err) => { if (err) throw err; });
      } else console.log('error : ', error);
    }
    if (i > 0 && i % 30 === 0) stop = prompt('stop processing ? ');
  }
})();