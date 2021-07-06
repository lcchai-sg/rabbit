const axios = require('axios');
const puppeteer = require('puppeteer');

(async () => {
    const e = "https://www.hermes.com/us/en/product/heure-h-watch-17.2-x-17.2mm-W037891WW00/";
    // try {
    //     const { data } = await axios.get(e);
    //     console.log('data : ', data);
    // } catch (error) {
    //     console.log('Axios failed with error : ', error.response.status);
    // }

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(e, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
    await new Promise(r => setTimeout(r, 30000));
    const pdata = await page.evaluate(() => document.body.innerHTML);
    console.log('pdata : ', pdata);
    await browser.close()
    console.log();
    console.log('done.');
})();