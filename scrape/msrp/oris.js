const fetch = require('node-fetch');
const cheerio = require('cheerio');
const proxy_dnk_ip = '217.61.236.218';
const proxy_usa_ip = 'usvpn.tell.com';
const proxy_host = '3128';
const proxy_user = 'proxyclient';
const proxy_password = '4uFra6iTrAw1Pr';
const e = 'https://oris.ch/api/en/watchfinder/getdata/';
const countryCode = "USD";
const HttpsProxyAgent = require("https-proxy-agent");
const proxyAgent = new HttpsProxyAgent({
    host: proxy_usa_ip,
    port: proxy_host,
    auth: proxy_user + ':' + proxy_password,
});
const config = { agent: proxyAgent };

(async () => {
    const res = await fetch(encodeURI(e));
    const data = await res.json();
    const watchBaseUrl = 'https://www.oris.ch/api/en/Watch/GetWatch/';
    const wUrl = 'https://oris.ch/en/watch/';
    const watchesList = data.models ? data.models : [];
    const pathArr = []
    watchesList.map(x => {
        const url = wUrl + x.watchId + '/' + x.id;
        pathArr.push({ url, id: x.id });
    })
    console.debug('total : ', pathArr.length);
    const results = []; const uniq = [];
    for (let i = 0; i < pathArr.length; i++) {
        if (i > 0 && i % 100 === 0) {
            console.debug(`processing ${cnt} / ${pathArr.length}`);
        }
        const w = pathArr[i];
        try {
            const res = await fetch(encodeURI(w.url), config);
            const data = await res.text();
            const $ = cheerio.load(data);
            const url = $('meta[property="og:url"]').attr('content');
            if (url) {
                const u = url.split('/');
                const aUrl = watchBaseUrl + u[u.length - 2] + "/" + u[u.length - 1];
                console.log(w, ' >>> ', aUrl);
                const res = await fetch(encodeURI(aUrl), config);
                const data = await res.json();
                if (data && data.models) {
                    const watchDetail = data.models.filter(x => x.id === w.id && x.isoCurrencySymbol == countryCode);
                    for (const w of watchDetail) {
                        const reference = w.reference;
                        const amount = parseFloat(w.price);
                        results.push({ reference, amount });
                        console.log({ reference, amount });
                    }
                }
            }
        } catch (error) {
            console.error('Failed MSRP scraping for Oris with error : ', error);
        }
    }
    console.log(`results : ${results.length}         uniq : ${uniq.length}`);
    results.forEach(r => { console.log(r) });
    console.log();
    console.log('done.');
})();
