const axios = require('axios');
const cheerio = require('cheerio');
const Sitemapper = require('sitemapper');

const indexing = async () => {
  const entry = "https://www.cartier.com/sitemap.xml";
  const sitemap = new Sitemapper({
    url: entry,
    timeout: 600000,
  });

  const d = await sitemap.fetch();
  let c = 0;
  for (let i = 0; i < d.sites.length; i++) {
    if (d.sites[i].match(/watch/i)) {
      console.log(d.sites.length, i, d.sites[i]);
      try {
        const { data } = await axios.get(d.sites[i]);
        const $ = cheerio.load(data);
        let b = []
        $('.c-breadcrumb__list-item').each((idx, el) => {
          b.push($(el).text().trim());
        });
        if (b.length >= 4) {
          console.log('   watch >>> ', b.join(' / '));
        }
        // const brc = $('.c-breadcrumb__list').text().replace(/(?:\r\n|\r|\n|\s+)/g, ' / ').trim();
        // if (brc.match(/watches/i)) {
        //   console.log(brc);
        //   c++;
        // }
      } catch (error) {
        console.log(error.response.status);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.log();
  console.log('num watches: ', c);
}

const extraction = async (context) => {
  try {

    // const { client, entry, lang, brand, brandID, base, gender } = context;
    const entry = "https://www.cartier.com/en-us/collections/watches/mens-watches/ballon-bleu-de-cartier/hpi00582-ballon-bleu-de-cartier-watch.html";
    const result = {
      source: 'official',
      url: entry,
      brand: "Cartier",
      brandID: 28,
      lang: "en",
      gender: "F",
      scripts: [],
      spec: [],
      related: []
    };
    const { data } = await axios.get(entry);
    const $ = cheerio.load(data);
    result.description = $('div.tabbed-content__content-column > p.paragraph').first().text().trim();
    result.thumbnail = $('.c-image-adaptive').attr('data-original-url');
    // let collect = '';
    // if (entry.indexOf('mens-watches') > -1) {
    //   collect = entry.split("/mens-watches/")[1].split('/')[0];
    //   result.gender = 'M';
    // }
    // else {
    //   collect = entry.split("/women-s-watches/")[1].split('/')[0];
    //   result.gender = 'F';
    // }
    // if (collect) {
    //   result.collection = collect;
    // }
    result.name = $('.top-heading').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.small-text.js-pdp__cta-section--product-ref-id').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split(":")[1].trim();
    // $('.tabbed-content__content-column').each((idx, el) => {
    //   const key = $(el).find('h3').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    //   const value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    //   if (key) {
    //     result.spec.push({ key, value });
    //   }
    // });
    result.attributes = result.description.split('. ');

    return result;
  } catch (error) {
    console.log(error);
    return {};
  }
};

(async () => {
  // indexing();
  let r = await extraction({});
  console.log(r);
})();
