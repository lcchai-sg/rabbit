const axios = require('axios');
const fetch = require('cross-fetch');
const HttpsProxyAgent = require("https-proxy-agent");

(async () => {
    // SG
    const e = "https://www.tudorwatch.com/sitecore/api/layout/render/jss?item=%2Fwatches&sc_lang=en&sc_apikey=88D46ADA-EC38-48B8-9428-0FCA53E86F63:443";
    // const e = "https://www.tudorwatch.com/sitecore/api/layout/render/jss?item=%2Fwatches&sc_lang=en&sc_apikey=88D46ADA-EC38-48B8-9428-0FCA53E86F63";
    // dnk_ip: '217.61.236.218',
    // usa_ip: 'usvpn.tell.com',
    // port: '3128',
    // user: 'proxyclient',
    // pass: '4uFra6iTrAw1Pr', 
    // const proxyAgent = new HttpsProxyAgent({
    //     host: 'usvpn.tell.com',
    //     port: 3128,
    //     auth: 'proxyclient:4uFra6iTrAw1Pr',
    // });
    // config = { agent: proxyAgent }
    const cfg = {
        proxyurl: "https://",
        // proxy: {
        //     protocol: "sock5",
        //     host: 'usvpn.tell.com',
        //     port: 3128,
        //     auth: { username: 'proxyclient', password: '4uFra6iTrAw1Pr' }
        // }
    }
    const { data } = await axios.get(e, cfg);
    // const res = await fetch(e, config);
    // const data = await res.json();
    const p = data.sitecore.route.placeholders["jss-main"][1].fields.CollectionList;
    for (let i = 0; i < p.length; i++) {
        console.log({ reference: p[i].rmc.toUpperCase(), amount: parseFloat(p[i].grossPrice), currency: p[i].country })
    }
})();