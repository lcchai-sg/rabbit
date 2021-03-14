const axios = require('axios');
const u = require('./assets');

(async () => {
    for (let i = 0; i < u.length; i++) {
        try {
            const fs = "https://synopsis.cosmos.ieplsg.com/files/";
            const { data } = await axios.get(fs + u[i]);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('NOT FOUND : ', u[i]);
            } else console.log(error);
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();