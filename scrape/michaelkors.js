const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

const extraction = async context => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], }
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    // result.name = $('meta[name="og:title"]').attr('content');
    result.name = $('meta[name="og:title"]').attr('content').split('|')[0].trim();
    result.description = $('meta[name="description"]').attr('content');
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    $('script').each((idx, el) => {
      const d = $(el).contents().toString();
      if (d.match(/window.__INITIAL_STATE__ =/i)) {
        const dd = d.match(/"richTextDescription":"(.*)","displayName"/ig);
        const ddd = dd[0].split(',');
        ddd.forEach(v => {
          if (v.match(/richTextDescription/i)) {
            const vvv = v.replace(new RegExp('"', 'g'), '').replace(new RegExp('\\\\n', 'g'), '').replace(new RegExp('\\n', 'g'), '').replace('richTextDescription:', '');
            const vv = vvv.match(/<br \/>/i) ? vvv.split('<br />') :
              vvv.match(/<br>/) ? vvv.split('<br>') :
                vvv.match(/<BR>/) ? vvv.split('<BR>') : vvv.split('<br/>');
            result.spec = vv.filter(v => v);
          }
          if (v.match(/highSalePrice/i)) result.price = v.split(':')[1];
        })
      }
    })
  } catch (error) {
    console.log(error);
    console.log('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
}

const indexing = async context => {
  const source = "official";
  const lang = "en";
  const brand = "Michael Kors";
  const brandID = 190;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
  try {
    const { data } = await client.get(entry);
    const parser = new xml2js.Parser();
    parser.parseString(data, (err, res) => {
      for (let i = 1; i < res.urlset.url.length; i++) {
        const url = res.urlset.url[i]['loc'][0];
        if (url.match(/watch/i) && !(url.match(/watch-strap/i))) {
          if (res.urlset.url[i]['image:image']) {
            let name = res.urlset.url[i]['image:image'][0]['image:title'][0];
            name = name.slice(0, name.length - 2);
            let image = res.urlset.url[i]['image:image'][0]['image:loc'][0];
            let thumbnail = image.split('_')[0] + '_1';
            const ref = url.split('/');
            const reference = ref[ref.length - 1].replace('R-US_', '');
            result.items['all'].push({
              source, lang, brand, brandID, url, name, reference, thumbnail,
            })
          }
        }
      }
    })
    return result;
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  const r = await indexing({
    client: axios,
    // entry: 'https://www.michaelkors.com/product-image-sitemap_en_US.xml',
    entry: "https://www.michaelkors.global/en_SG/product-image-sitemap_en_SG.xml",
    base: 'https://www.michaelkors.com/',
  });
  // console.log(r);
  // r.items['all'].forEach(w => console.log(w));

  // const r = {
  //   source: "official",
  //   lang: "en",
  //   brand: "Michael Kors",
  //   brandID: 190,
  //   collections: ['all'],
  //   items: {
  //     'all': [
  //       {
  //         url: 'https://www.michaelkors.global/en_SG/oversized-bradshaw-gold-tone-watch/_/R-MK5739',
  //       },
  //     ]
  //   }
  // };

  // for (let i = 0; i < 1; i++) {
  for (let i = 0; i < r.items['all'].length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r.items['all'][i].url,
      ...r.items['all'][i],
    });
    console.log(ex.url)
    console.log(ex.spec);
    console.log()
  }
})();