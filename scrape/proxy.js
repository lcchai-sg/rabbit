const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    //HK - Hong Kong / DE - Germany / US - United States / JP -	Japan / GB - United Kingdom
    //CA - Canada / TW - Taiwan / FR - France
    const c = ['HK', 'DE', 'US', 'JP', 'GB', 'CA', 'TW', 'FR'];
    const p = {};
    const { data } = await axios.get("https://sslproxies.org/");
    const $ = cheerio.load(data);

    $("tr").each((idx, el) => {
        const ip = $(el).find("td:nth-child(1)").text();
        const port = $(el).find("td:nth-child(2)").text();
        const code = $(el).find("td:nth-child(3)").text().toUpperCase();
        const country = $(el).find("td:nth-child(4)").text();
        const anon = $(el).find("td:nth-child(5)").text();
        if (c.indexOf(code) >= 0) {
            if (!p[country]) p[country] = [];
            p[country].push({
                ip, port, anon,
                // ip, port, code, country,
            })
        }
    })

    // console.log(p);
    Object.keys(p).sort().forEach(c => {
        console.log();
        console.log(`country : ${c}`);
        p[c].forEach(d => {
            console.log(`IP : ${d.ip}   PORT : ${d.port}      ANONYMOUS: ${d.anon}`);
        })
    })
    console.log('done...................');
})()
