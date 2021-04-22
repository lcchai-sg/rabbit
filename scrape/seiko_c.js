const axios = require('axios');

(async () => {
    for (let i = 0; i < 300; i++) {
        const link = 'https://products.seikowatches.com/v1/products?brand=' + i + '&format=json&limit=1000&locale=jp-en&sort=-release';
        try {
            const { data } = await axios.get(link);
            if (data.results && data.results.length > 0) console.log(i, '   result : ', data.results.length);
        } catch (e) {
            if (e.response) console.log(i, '    error : ', e.response.status);
            else console.log('error occurred.')
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();