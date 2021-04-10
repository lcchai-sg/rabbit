const axios = require('axios');
const fs = require('fs');
const u = require('./urls');

(async () => {
    for (let i = 0; i < u.length; i++) {
        try {
            const { headers } = await axios.get(u[i]);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                fs.appendFile('u404.txt', u[i] + '\n', (err) => { if (err) throw err; })
            } else console.log(error);
        }
    }
    console.log();
    console.log('end.');
    process.exit(0);
})();