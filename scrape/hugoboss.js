const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const extraction = async context => {
  const result = { ...context, };
  const { data } = await axios.get(result.url);
  const $ = cheerio.load(data);
  result.name = $('.stage__header-title').text().trim();
  result.reference = $('.stage__header-subline').text().trim();
  result.thumbnail = $('.js-stage-images-item').first().find('img').attr('src');
  result.description = $('.product-container__text--description').text().trim();
  const techData = $('#product-container-details-pannel').contents();
  result.spec = [];
  if (techData) {
    Object.keys(techData).forEach(key => {
      if (!(isNaN(key))) {
        if (techData[key]['type'] === 'text') result.spec.push(techData[key]['data'].replace(/(\t|\r|\n)/g, ''))
      }
    })
  }
  return result
}

const indexing = async context => {
  const urls = [
    "https://www.hugoboss.com/men-watches/",
    "https://www.hugoboss.com/women-watches/",
  ];
  const result = [];
  const uniq = [];
  for (const url of urls) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const w = parseInt($('.search-result-options__brand-badge').first().text());
    const np = Math.ceil(w / 60);
    for (let i = 0; i < np; i++) {
      link = url + "?start=" + i * 60 + "&sz=60";
      console.log(link)
      const { data } = await axios.get(link);
      const $ = cheerio.load(data);
      $('script[type="application/json"]').each((idx, el) => {
        const d = $(el).contents();
        const j = JSON.parse(d['0']['data']);
        if (j.category === 'Watches') {
          result.push({
            url: j['@id'], name: j.name, thumbnail: j.image[0], description: j.description,
            sku: j.sku, reference: j.mpn.replace('hbeu', '').replace('_999', ''),
          });
          if (uniq.indexOf(j['@id']) < 0) uniq.push(j['@id']);
        }
      })
    }
  }
  console.log('result count >', result.length);
  console.log('uniq count >', uniq.length);
  return result;
}

(async () => {
  const r = await indexing();
  // r.forEach(v => console.log(v.url));

  // const r = [
  //   'https://www.hugoboss.com/stainless-steel-watch-with-blue-dial-and-link-bracelet/hbeu58082953_999.html?cgid=75230',
  //   'https://www.hugoboss.com/blue-plated-watch-with-swarovski%C2%AE-crystals-and-mesh-bracelet/hbeu58082881_999.html?cgid=75230',
  //   'https://www.hugoboss.com/swarovski%C2%AE-crystal-trimmed-watch-with-polished-silver-finish/hbeu58089023_999.html?cgid=75230',
  //   'https://www.hugoboss.com/stainless-steel-watch-with-patterned-blue-dial/hbeu58089075_999.html?cgid=75230',
  //   'https://www.hugoboss.com/stainless-steel-chronograph-watch-with-blue-dial-and-rotating-bezel/hbeu58079087_999.html?cgid=25400',
  //   'https://www.hugoboss.com/contrast-dial-chronograph-watch-with-black-leather-strap/hbeu58089029_999.html?cgid=25400',
  // ];
  // for (let i = 0; i < r.length; i++) {
  //   const ex = await extraction(r[i]);
  //   console.log(ex.spec);
  // }
})();