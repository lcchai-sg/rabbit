const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const indexing = async context => {
  const entry = "https://www.tudorwatch.com/sitemap-en.xml";
  const sitemap = new sitemapper({
    url: entry,
    timeout: 300000,
  });
  const source = "official";
  const lang = "en";
  const brand = "Tudor";
  const brandID = 2;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  try {
    const d = await sitemap.fetch();
    d.sites.forEach(d => {
      if (d.match(/\/watches\//i)) {
        const dd = d.split('/');
        if (dd.length === 7) {
          const reference = dd[dd.length - 1]
          const collection = dd[dd.length - 2].replace(/-/g, ' ').toUpperCase();
          if (result.collections.indexOf(collection) < 0) {
            result.collections.push(collection);
            result.items[collection] = [];
          }
          result.items[collection].push({
            source, lang, brand, brandID, url: d, collection, name: collection,
            reference, price: null, thumbnail: null,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
  return result;
}

const extraction = async context => {
  const result = { url: context, spec: [], related: [], };
  try {
    const imagebase = "https://www.tudorwatch.com/-/media";
    const e1 = "https://www.tudorwatch.com/sitecore/api/jss/dictionary/tudorwatch/en?sc_apikey=88D46ADA-EC38-48B8-9428-0FCA53E86F63";
    const dict = (await axios.get(e1)).data;
    const entry = context;
    const { data } = await axios.get(entry);
    const $ = cheerio.load(data);
    const d = $('script[type="application/json"]').contents();
    const dd = JSON.parse(d['0']['data']);
    const wd = dd.sitecore.context.rmc;
    result.name = dict.phrases[wd.name].replace(/&nbsp;/g, ' ');
    result.reference = wd.rmc;
    wd.images.forEach(v => {
      if (v.match(/\/upright\/l\//)) result.thumbnail = imagebase + v;
    })
    for (const s of wd.specs) {
      result.spec.push({
        key: s.title,
        value: dict.phrases[s.text].replace(/&nbsp;/g, ' '),
      })
    }
    result.price = wd.price;
    wd.suggestions.forEach(w => {
      result.related.push(w.rmc);
    })
  } catch (error) {
    result.code = error.response.status;
  }

  return result;
}

(async () => {
  // const r = await indexing();
  // console.log(r)

  // r.collections.forEach(c => {
  //   console.log('collection ', c)
  //   r.items[c].forEach(w => {
  //     console.log('     ', w.url)
  //   })
  // })

  const ex = [
    "https://www.tudorwatch.com/en/watches/glamour-date/m51000-0027",
    "https://www.tudorwatch.com/en/watches/glamour-double-date/m57103-0023",
    "https://www.tudorwatch.com/en/watches/glamour-date-day/m56008-0021",
    "https://www.tudorwatch.com/en/watches/glamour-date-day/m56008-0023",
    "https://www.tudorwatch.com/en/watches/black-bay-p01/m70150-0001",
    "https://www.tudorwatch.com/en/watches/fastrider-black-shield/m42000cn-0005",
  ];

  for (let i = 0; i < ex.length; i++) {
    const ext = await extraction(ex[i]);
    console.log(ext);
    console.log();
    console.log();
  }
})();