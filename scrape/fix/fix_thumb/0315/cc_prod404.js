const axios = require('axios');
const u = require('./c_prod404');
const fs = require('fs');

(async () => {
  for (let i = 0; i < u.length; i++) {
    console.log(u.length, i)
    try {
      const { data } = await axios.get(u[i]);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const cmd = 'db.reference_product.updateMany({url:"' + u[i] + '"},{$set:{code:404, updatedBy:"LCC", updatedOn: new Date()}})\n';
        fs.appendFile('f404.txt', cmd, (err) => { if (err) throw err; });
      } else console.log(err);
    }
    await new Promise(r => setTimeout(r, 3000))
  }
})();