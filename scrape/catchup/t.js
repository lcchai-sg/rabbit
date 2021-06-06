const axios = require('axios');

(async () => {
    const { data } = await axios.get('https://www.patek.com/en/collection/pocket-watches/980G-001')
    const pr = data.match(/{ id: \w+, pattern: "\w+", price: "(.*)" }/ig);
    const usp = pr ? pr[0].match(/pattern: "US", Price: "(\w+|'| )*"/ig) : null;
    const sgp = pr ? pr[0].match(/pattern: "SG", Price: "(\w+|'| )*"/ig) : null;
    const chp = pr ? pr[0].match(/pattern: "CH", Price: "(\w+|'| )*"/ig) : null;
    const prc = usp ? usp[0] : sgp ? sgp[0] : chp ? chp[0] : null;
    if (prc) {
        const p = prc.split(':')
        const retail = p[p.length - 1].replace(/'/g, ',').trim();
        console.log(`retail : ${retail}`)
    }
    process.exit(0)
})()