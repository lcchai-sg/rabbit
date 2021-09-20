const u = [
    "https://www.chanel.com/us/watches/p/H0451/premiere-rock-watch/",
    "https://www.chanel.com/us/watches/p/H0940/j12-chronograph-watch-41-mm/",
    "https://www.chanel.com/us/watches/p/H2009/j12-chronograph-watch-41-mm/",
    "https://www.chanel.com/us/watches/p/H2032/premiere-mini-watch/",
    "https://www.chanel.com/us/watches/p/H2132/premiere-mini-watch/",
    "https://www.chanel.com/us/watches/p/H2163/premiere-mini-watch/",
    "https://www.chanel.com/us/watches/p/H2437/premiere-mini-watch/",
];

const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    for (let i = 0; i < u.length; i++) {
        const { data } = await axios.get(u[i]);
        const $ = cheerio.load(data);
        const thumbnail = $('.carousel__slide-container').find('img:nth-child(2)').attr('async-src');
        console.log(u[i], thumbnail);
    }
})();