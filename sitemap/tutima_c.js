const axios = require('axios');
const cheerio = require('cheerio');

const ref_urls = [
  "https://tutima.com/watch/flieger-automatic-6105-29/",
  "https://tutima.com/watch/admiral-blue-6610-01/",
  "https://tutima.com/watch/lady-s-6703-04/",
  "https://tutima.com/watch/lady-s-6703-03/",
  "https://tutima.com/watch/lady-s-6703-01/",
  "https://tutima.com/watch/lady-s-6703-02/",
  "https://tutima.com/watch/saxon-one-6701-02/",
  "https://tutima.com/watch/saxon-one-6701-01/",
  "https://tutima.com/watch/sky-automatic-6105-20/",
  "https://tutima.com/watch/flieger-automatic-6105-22/",
  "https://tutima.com/watch/m2-coastline-chronograph-6430-05/",
  "https://tutima.com/watch/m2-coastline-chronograph-6430-06/",
  "https://tutima.com/watch/m2-coastline-chronograph-6430-04/",
  "https://tutima.com/watch/m2-coastline-chronograph-6430-02/",
  "https://tutima.com/watch/chronograph-6420-09/",
  "https://tutima.com/watch/chronograph-racing-red-6420-07/",
  "https://tutima.com/watch/admiral-blue-6610-02/",
  "https://tutima.com/watch/patria-6610-02/",
  "https://tutima.com/watch/m2-coastline-chronograph-6430-03/",
  "https://tutima.com/watch/flieger-automatic-6105-26/",
  "https://tutima.com/watch/flieger-automatic-6105-24/",
  "https://tutima.com/watch/m2-coastline-6150-06/",
  "https://tutima.com/watch/m2-coastline-6150-04/",
  "https://tutima.com/watch/m2-coastline-6150-03/",
  "https://tutima.com/watch/m2-coastline-6150-02/",
  "https://tutima.com/watch/seven-seas-6151-04/",
  "https://tutima.com/watch/seven-seas-6151-02/",
  "https://tutima.com/watch/seven-seas-6151-03/",
  "https://tutima.com/watch/seven-seas-6151-01/",
  "https://tutima.com/watch/airport-chronograph-6406-01/",
  "https://tutima.com/watch/airport-chronograph-6406-03/",
  "https://tutima.com/watch/airport-automatic-6106-04/",
  "https://tutima.com/watch/airport-automatic-6106-01/",
  "https://tutima.com/watch/tempostopp-6650-01/",
  "https://tutima.com/watch/saxon-one-6700-02/",
  "https://tutima.com/watch/saxon-one-6700-01/",
  "https://tutima.com/watch/lady-6701-04/",
  "https://tutima.com/watch/lady-6701-03/",
  "https://tutima.com/watch/lady-6700-04/",
  "https://tutima.com/watch/lady-6700-03/",
  "https://tutima.com/watch/lady-s-6702-02/",
  "https://tutima.com/watch/flieger-automatic-6105-01/",
  "https://tutima.com/watch/flieger-automatic-6105-02/",
  "https://tutima.com/watch/flieger-automatic-6105-04/",
  "https://tutima.com/watch/flieger-automatic-6105-03/",
  "https://tutima.com/watch/flieger-automatic-6105-30/",
  "https://tutima.com/watch/power-reserve-6602-01/",
  "https://tutima.com/watch/lady-6702-01/",
  "https://tutima.com/watch/airport-automatic-6101-03/",
  "https://tutima.com/watch/grand-flieger-6401-03/",
  "https://tutima.com/watch/m-automatic-6120-04/",
  "https://tutima.com/watch/automatic-steel-blue-6121-03/",
  "https://tutima.com/watch/automatic-maroon-brown-6121-01/",
  "https://tutima.com/watch/grand-flieger-6401-01/",
  "https://tutima.com/watch/grand-flieger-6101-01/",
  "https://tutima.com/watch/m-automatic-6121-05/",
  "https://tutima.com/watch/m-automatic-6121-08/",
  "https://tutima.com/watch/m-automatic-6121-07/",
  "https://tutima.com/watch/classic-automatic-6102-06/",
  "https://tutima.com/watch/classic-automatic-6102-03/",
  "https://tutima.com/watch/m2-6450-02/",
  "https://tutima.com/watch/automatic-royal-blue-6120-05/",
  "https://tutima.com/watch/patria-6600-01/",
  "https://tutima.com/watch/hommage-6800-01/",
  "https://tutima.com/watch/patria-6600-02/",
  "https://tutima.com/watch/hommage-6800-02/",
  "https://tutima.com/watch/patria-6601-01/",
  "https://tutima.com/watch/patria-6601-02/",
  "https://tutima.com/watch/grand-flieger-6402-02/",
  "https://tutima.com/watch/grand-flieger-6401-02/",
  "https://tutima.com/watch/grand-flieger-6102-02/",
  "https://tutima.com/watch/grand-flieger-6102-01/",
  "https://tutima.com/watch/grand-flieger-6101-02/",
  "https://tutima.com/watch/grand-flieger-6402-01/",
  "https://tutima.com/watch/saxon-one-6422-01/",
  "https://tutima.com/watch/saxon-one-6422-02/",
  "https://tutima.com/watch/saxon-one-6120-03/",
  "https://tutima.com/watch/saxon-one-6120-02/",
  "https://tutima.com/watch/saxon-one-6120-04/",
  "https://tutima.com/watch/saxon-one-6420-03/",
  "https://tutima.com/watch/saxon-one-6120-01/",
  "https://tutima.com/watch/saxon-one-6420-02/",
  "https://tutima.com/watch/m2-6451-02/",
  "https://tutima.com/watch/saxon-one-6420-01/",
  "https://tutima.com/watch/saxon-one-6420-04/",
  "https://tutima.com/watch/m2-6450-03/",
  "https://tutima.com/watch/m2-6451-03/",
  "https://tutima.com/watch/chronograph-royal-blue-6420-05/"
];

const urls = [
  "https://tutima.com/watches/patria/",
  "https://tutima.com/watches/m2/",
  "https://tutima.com/watches/saxon-one/",
  "https://tutima.com/watches/grand-flieger/",
  "https://tutima.com/watches/sky/",
  "https://tutima.com/watches/tempostopp/",
  "https://tutima.com/watches/hommage/",
];

(async () => {
  const wurl = [];
  for (const u of urls) {
    const { data } = await axios.get(u);
    const $ = cheerio.load(data);
    $('article').each((idx, el) => {
      const url = $(el).find('a').attr('href');
      wurl.push(url);
    })
  }
  console.log('watches >>>', wurl.length);
  wurl.forEach(w => {
    if (ref_urls.indexOf(w) < 0) {
      console.log('NOT FOUND >>>>>', w);
    }
  })

  console.log()
  console.log()
  console.log()

  ref_urls.forEach(r => {
    if (wurl.indexOf(r) < 0) {
      console.log('NO WEB >>>>>', r)
    }
  })
})();