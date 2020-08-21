const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const urls = [
    "https://www.hublot.com/en-sg/watches/big-bang/big-bang-unico-sky-blue-45-mm",
    "https://www.hublot.com/en-sg/watches/mp/techframe-ferrari-tourbillon-chronograph-sapphire-white-gold-45-mm",
    "https://www.hublot.com/en-sg/watches/mp/big-bang-mp-09-tourbillon-bi-axis-3d-carbon-45-mm",
    "https://www.hublot.com/en-sg/watches/classic-fusion/classic-fusion-aerofusion-chronograph-orlinski-red-ceramic-45-mm"
  ];
  for (const url of urls) {
    console.log(url)
    const d = (await axios.get(url)).data;
    const $ = cheerio.load(d);
    $('script').each((idx, el) => {
      if ($(el).attr('type') === "application/json") {
        let c = $(el).contents();
        const d = JSON.parse(c['0'].data);
        // console.log(d)
        console.log(d.gtm.pageproduct.products)
        console.log(d.prices[d.gtm.pageproduct.products[0].id])
      }
    })
  }
})();
