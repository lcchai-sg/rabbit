const axios = require('axios');

(async () => {
    const url = "https://www.kechiq.com/API/brand/getAll";
    const config = { params: { "Kechiq-Shared-Key": "AnticipaSharedKey", "emulateJSON": true } };
    try {
        const { data } = await axios.get(url, config);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
})();