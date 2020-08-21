const { MessageStation } = require("@cosmos/utils");
const cheerio = require('cheerio');
const axios = require('axios');
const shortid = require('shortid');

(async () => {
  const station = await MessageStation
    .connect({
      host: '127.0.0.1',
      user: 'synopsis',
      pass: 'synopsis',
      vhost: '/lc'
    });

  const proxy = {
    host: '44.231.67.49',
    port: 80,
  }
  const results =
    { source: 'official', collections: [], items: {} };
  const entry = "https://www.hamiltonwatch.com/en-us/collection.html";
  const d = (await axios.get(entry, proxy)).data;
  const $ = cheerio.load(d);
  const cats = [];
  const lang = 'en';

  $('li.item').each((idx, el) => {
    const url = $(el).find('button').attr('data-href');
    const txt = $(el).find('button').text().trim();
    if (url && url.indexOf('?cat=') > 0) {
      let td = txt.split('                                            ');
      let name = td[0]
      let nWatches = parseInt(td[1].split(' ')[0])
      results.collections.push(name);
      results.items[name] = [];
      cats.push({ name, url, nWatches });
    }
  });

  const perPage = 12;
  const client = axios;
  for (const cat of cats) {
    const numPages = Math.ceil(cat.nWatches / perPage);
    for (let i = 1; i <= numPages; i++) {
      await new Promise(r => setTimeout(r, 3000));

      const link = cat.url + '&p=' + i;
      console.log(link)
      const d = (await client.get(link, proxy)).data;
      const $ = cheerio.load(d);
      $('li.product-item').each((idx, el) => {
        const reference = $(el).attr('data-sku');
        const url = $(el).find('.product-item-photo').attr('href')
        const thumbnail = $(el).find('img').attr('data-src')
        const name = $(el).find('.product-name').text().trim();
        const retail = $(el).find('.price-wrapper').attr('data-price-amount');
        results.items[cat.name].push({
          source: 'official',
          url,
          thumbnail,
          collection: cat.name,
          lang,
          name,
          reference,
          retail
        });
      });
    }
  }

  const channel = await station.createChannel();

  for (const key of Object.keys(results.items)) {
    for (let i = 0; i < results.items[key].length; i++) {
      const data = results.items[key][i];

      const job = {
        dryRun: false,
        payload: {
          strategy: 'hamilton',
          command: "extraction",
          proxy: null,
          agent: null,
          context: {
            entry: data.url,
            brand: 'Hamilton',
            brandID: 999,
            productID: null,
            lang: data.lang,
            price: data.price,
            thumbnail: data.thumbnail,
            retail: data.retail
          }
        }
      };

      console.log('publish >', job)
      await new Promise(r => setTimeout(r, 2000));
      await channel.publish(
        'scraperLC',
        'SLC-jobs',
        Buffer.from(JSON.stringify(job)),
        { replyTo: 'SLC-distill', correlationId: shortid.generate() });
    }
  }

  process.exit(0)

})();
