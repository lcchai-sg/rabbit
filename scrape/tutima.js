const axios = require('axios');
const cheerio = require('cheerio');
const Sitemapper = require('sitemapper');

const indexing = async (context) => {
  // const entry = "https://tutima.com/sitemaps.xml";
  const source = "official";
  const lang = "en";
  const brand = "Tutima";
  const brandID = 254;
  const { client, entry, } = context;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
  try {
    const sitemap = new Sitemapper({
      url: entry,
      timeout: 600000,
    });

    const d = await sitemap.fetch();
    for (let i = 0; i < d.sites.length; i++) {
      if (d.sites[i].match(/tutima.com\/watch\//i)) {
        const u = d.sites[i].split('/');
        const n = u[u.length - 2].split('-');
        const reference = n[n.length - 2] + '-' + n[n.length - 1];
        const name = n.slice(0, n.length - 2).join(' ');
        result.items['all'].push({
          source, lang, brand, brandID, url: d.sites[i],
          name, reference, price: null,
        });
      }
    }
    return result;
  } catch (error) {
    console.error('Failed indexing for Tutima with error : ' + error)
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], }
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.description = $('meta[property="og:description"]').attr('content');
    result.image = $('meta[property="og:image"]').attr('content');
    result.collection = $('.subtitle').text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim();
    result.name = $('hgroup>h2').text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim();
    const ref = result.name.split(' ');
    result.reference = ref[ref.length - 1];
    let key = "";
    let value = "";
    let hasInfo = true;
    $('.info-table tr td').each((idx, el) => {
      value = $(el).text().trim();
      if (idx === 0 && value === 'Movement') hasInfo = false;
      if (hasInfo) {
        if (idx % 2 === 0) {
          if (idx === 0) result.spec.push({ key: 'info', value, });
          else result.spec.push({ key, value, });
        } else key = value;
      } else {
        if (idx % 2 === 0) key = value;
        else result.spec.push({ key, value, });
      }
    })
    $('.product-details>p').each((idx, el) => {
      const d = $(el).text().split(':');
      const key = d[0].trim();
      const value = d[1].trim();
      const dd = value.split('. ');
      for (let v = 0; v < dd.length; v++) {
        result.spec.push({ key, value: dd[v] })
      }
    })
  } catch (error) {
    console.error('Failed extraction for Tutima with error : ' + error);
    console.error('url:', entry);
    result.code = error.response.status;
  }
  return result;
};

(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: "https://tutima.com/sitemaps.xml",
  // });

  const r = [
    {
      "source": "official",
      "lang": "en",
      "brand": "Tutima",
      "brandID": 254,
      "url": "https://tutima.com/watch/admiral-blue-6610-02/",
    },
    {
      "source": "official",
      "lang": "en",
      "brand": "Tutima",
      "brandID": 254,
      "url": "https://tutima.com/watch/patria-6610-02/",
    },
    {
      "source": "official",
      "lang": "en",
      "brand": "Tutima",
      "brandID": 254,
      "url": "https://tutima.com/watch/m2-coastline-chronograph-6430-03/",
    },
    {
      "source": "official",
      "lang": "en",
      "brand": "Tutima",
      "brandID": 254,
      "url": "https://tutima.com/watch/flieger-automatic-6105-26/",
    },
  ];

  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      ...r[i],
      client: axios,
      entry: r[i].url,
    })
    console.log(ex);
  }
})();
