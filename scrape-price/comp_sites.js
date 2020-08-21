const xml2js = require('xml2js');
const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const entry = "https://www.hamiltonwatch.com/pub/mediam2/sitemap/sitemap_en_us.xml";
  const parser = new xml2js.Parser();
  const sitemap = [];
  await axios.get(entry).then(resp => {
    const data = resp.data;
    parser.parseString(data, (err, res) => {
      for (let i = 1; i < res.urlset.url.length; i++) {
        if (res.urlset.url[i].priority[0] === '1.0') {
          const url = res.urlset.url[i]['loc'][0];
          sitemap.push(url);
          // const name = res.urlset.url[i]['image:image'][0]['image:title'][0];

          // let d = url.split('/');
          // d = d[d.length - 1].replace('.html', '');
          // d = d.split('-');
          // let reference = '';
          // if (d[0].match(/h[0-9]{8}/)) {
          //   reference = d[0].toUpperCase();
          // } else {
          //   let r = d[d.length - 1].replace('.html', '');
          //   if (r.match(/h[0-9]{8}/)) {
          //     reference = r.toUpperCase();
          //   } else {
          //     reference = 'noRef' + i;
          //   }
          // }

          // console.log(reference, url);
        }
      }
    });
  });

  const entry1 = "https://www.hamiltonwatch.com/en-us/collection.html?p=";
  let prev = "";
  let page = 1;
  let stop = false;
  const web = [];
  do {
    const link = entry1 + page;
    // console.log(link)
    const $ = cheerio.load((await axios.get(link)).data);
    $(".item.product.product-item").each((idx, el) => {
      const reference = $(el).attr("data-sku");
      if (idx === 0) {
        if (prev === reference) stop = true; else prev = reference;
      }
      const url = $(el).find("a").attr("href");
      web.push(url);
      // const price = $(el).find(".price-wrapper").attr("data-price-amount");
      // console.log(reference, url);
    });
    page++;
  } while (!stop);

  for (const u of sitemap) {
    if (web.indexOf(u) < 0) {
      console.log('not in website >', u);
    }
  }
  for (const u of web) {
    if (sitemap.indexOf(u) < 0) {
      console.log('not in sitemap >', u)
    }
  }

  process.exit(0)
})();
