const axios = require('axios');
const cheerio = require('cheerio');
const Sitemapper = require('sitemapper');
const { Mappers, } = require('./utils');

const indexing = async (context) => {
  const { entry, } = context;
  console.log('Jomashop indexing ...', entry)
  const source = "jomashop";
  const lang = "en";
  const result = [];
  let payload = { source, lang, collections: ['all'], items: { 'all': [], } };
  try {
    let sitemap = new Sitemapper({
      url: entry,
      timeout: 300000,
    });
    let data = await sitemap.fetch();
    let cnt = 0;
    for (let i = 0; i < data.sites.length; i++) {
      if (data.sites[i].match(/-watch-/i) && !(data.sites[i].match(/event|sale|gift|deal|watches/i))) {
        let u = data.sites[i].split('/');
        let d = u[u.length - 1].split('-watch-');
        const { id: brandID, name: brand } = Mappers.generateBrandID.map(data.sites[i]);
        payload.items['all'].push({
          source, lang, brand, brandID, url: data.sites[i],
          name: d[1].replace('.html', '').replace(new RegExp('-', 'g'), ' '),
          reference: d[1].replace('.html', '').replace(new RegExp('-', 'g'), '.'),
          retail: null,
        });
        cnt++;
        if (cnt % 500 === 0) {
          result.push({ payload });
          payload = { source, lang, collections: ['all'], items: { 'all': [], } };
        }
      }
    }
    if (payload.items['all'].length > 0) result.push({ payload });
    console.debug('Jomashop indexing done.')
    return result;
  } catch (error) {
    console.error('Failed indexing for Jomashop with error : ' + error)
    return {};
  }
}

(async () => {
  const r = indexing({
    client: axios,
    entry: "https://www.jomashop.com/media/sitemaps/sitemap.xml",
  });
  console.log(r);
})();