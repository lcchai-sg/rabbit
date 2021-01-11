const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const urls = [
    // https://www.guess.com/us/en/men/accessories/watches/view-all?start=0&sz=36
    "https://www.guess.com/us/en/women/accessories/watches/view-all",
    "https://www.guess.com/us/en/men/accessories/watches/view-all",
  ];
  const uniqURL = [];

  for (let i = 0; i < urls.length; i++) {
    console.debug('>>>', urls[i])
    const { data } = await axios.get(urls[i]);
    const $ = cheerio.load(data);
    const ww = $(".refinements__trigger-results-count").text().trim();
    const w = parseInt(ww.split(' ')[0].replace("(", ""));
    const pp = 36;
    const nPages = Math.ceil(w / pp);
    const gender = urls[i].match(/women/i) ? 'F' : 'M';

    for (let p = 0; p < nPages; p++) {
      const link = urls[i] + '?start=' + p * pp + "&sz=36";
      console.debug(link);
      const { data } = await axios.get(link);
      const $ = cheerio.load(data);

      $('.product').each((idx, el) => {
        const reference = $(el).attr('data-variant-id');
        const thumbnail = $(el).find('img').first().attr('data-src');
        const url = $(el).find('a').attr('href');
        const name = $(el).find('img').first().attr('alt');
        const p = $(el).find('.price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        let price;
        let retail;
        if (p.match(/sale/i)) {
          let pp = p.split('Sale');
          price = pp[0].trim();
          retail = pp[1].trim();
        } else {
          price = p;
          retail = p;
        }
        if (uniqURL.indexOf(url) < 0) {
          uniqURL.push(url);
        }
        console.log({
          reference, thumbnail, url, name, price, retail, gender,
        })
      });
    }
  }
  console.log('unique URL >>>', uniqURL.length)

})();