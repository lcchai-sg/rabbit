const fetch = require('cross-fetch');
const axios = require('axios');
const e = "https://www.oris.ch/api/en/Watch/GetWatch/oris-aquis-small-second-date/01-743-7673-4135-07-4-26-34eb";
const proxy_usa_ip = 'usvpn.tell.com';
const proxy_host = '3128';
const proxy_user = 'proxyclient';
const proxy_password = '4uFra6iTrAw1Pr';
const HttpsProxyAgent = require("https-proxy-agent");
const proxyAgent = new HttpsProxyAgent({
    host: proxy_usa_ip,
    port: proxy_host,
    auth: proxy_user + ':' + proxy_password,
});
const config = { agent: proxyAgent };

(async () => {
    try {
        const res = await fetch(e, config);
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
})();