const axios = require('axios');

(async () => {
    const entry = "";
    const { data } = await axios.get(entry);
    console.log(data);
    process.exit(0)
})