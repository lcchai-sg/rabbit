const f = require('./seaw');
const axios = require('axios');

(async () => {
    for (let i = 0; i < f.length; i++) {
        try {
            const { data } = await axios.get(f[i]);
        } catch (error) {
            if (error.response && error.response.status === 404) console.log(f[i]);
            else console.log(error);
        }
    }
})();