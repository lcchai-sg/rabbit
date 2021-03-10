const u = require('./a_todel');
const axios = require('axios');

(async () => {
    for (let i = 0; i < u.length; i++) {
        const asset = "https://synopsis.cosmos.ieplsg.com/files/" + u[i];
        try {
            const { data } = await axios.get(asset);
            console.log("OK >>> ", asset);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // do nothing
            } else console.log("failed accessing " + asset + " with error : ", error);
        }
    }
})()