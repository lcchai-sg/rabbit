const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');

(async () => {
  const urls = [
    "https://www.prestigetime.com/luxury-watches-for-men.html",
    // "https://www.prestigetime.com/luxury-watches-for-men.html&page=2",
    "https://www.prestigetime.com/luxury-watches-for-women.html"
  ];

  const c_db_url = `mongodb+srv://root:sysadmin@cluster0-jrvjy.mongodb.net/synopsis?retryWrites=true&w=majority`;
  const c_conn = await MongoClient.connect(c_db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const c_db = c_conn.db("synopsis");

  for (const url of urls) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const wc = parseInt($('.text-muted').text().replace(" items", ""));
    const np = Math.ceil(wc / 48);

    for (let i = 1; i <= np; i++) {
      try {
        const link = url + "&page=" + i;
        console.log(link);
        const pdata = [];
        const { data } = await axios.get(link);
        const $ = cheerio.load(data);
        $('.thumbnail.thumbnail-center').each((idx, el) => {
          const result = {};
          result.thumbnail = $(el).find('img').attr('src');
          result.url = $(el).find('.caption-top').find('a').attr('href');
          result.brand = $(el).find('.caption-top').find('strong').text();
          result.name = $(el).find('.caption-top').find('span').first().text();
          result.reference = $(el).find('.caption-top').find('span').last().text();
          const rtl = $(el).find('.caption-bottom').text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim();
          const retl = rtl.split(' ');
          if (retl && retl[0] === 'Retail:') result.retail = retl[1];
          result.price = $(el).find('.caption-bottom').find('.price').text();
          pdata.push(result);
        });
        for (const result of pdata) {
          await c_db.collection('urls_ptime_web').updateOne(
            { url: result.url },
            {
              $setOnInsert: { source: "prestigetime", lang: "en", recordedAt: new Date(), },
              $set: {
                brand: result.brand, name: result.name, reference: result.reference,
                retail: result.retail, price: result.price, thumbnail: result.thumbnail,
                lastSeenAt: new Date(),
              }
            },
            { upsert: true }
          );
        }
      } catch (e) {
        console.log();
        console.log(e);
      }
    }
  }
})();