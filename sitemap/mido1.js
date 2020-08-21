const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  // const entry1 = "https://www.midowatches.com/us/sitemap.xml?page=1";
  // const d = (await axios.get(entry1)).data;
  // console.log(d)

  // const entry2 = "https://www.midowatches.com/us/sitemap.xml?page=2";
  // const d1 = (await axios.get(entry2)).data;
  // console.log(d1)

  const result = { collections: [], items: {} };

  const entry = "https://www.midowatches.com/us/swiss-watches-collections";
  const cats = [];
  const d = (await axios.get(entry)).data;
  const $ = cheerio.load(d);
  $('.collection-link').each((idx, el) => {
    const url = $(el).attr('href');
    const collection = $(el).text().trim();
    cats.push({ collection, url });
    result.collections.push(collection);
  })

  for (const cat of cats) {
    result.items[cat.collection] = [];
    let cnt = 0;
    let page = 0;
    do {
      cnt = 0;
      const link = cat.url + "?page=" + page;
      console.log(link)
      const d = (await axios.get(link)).data;
      const $ = cheerio.load(d);
      $('.col-12.col-md-6.col-lg-4.my-2.my-lg-4').each((idx, el) => {
        const url = $(el).find("a").attr("href");
        const thumbnail = $(el).find("img").attr("src");
        const name = $(el).find(".reference-collection").text().trim();
        const reference = $(el).find(".reference-number").text().trim();
        const price = $(el).find(".field--type-mido-price").text().trim();
        result.items[cat.collection].push({
          url, name, reference, price, thumbnail,
        });
        console.log(reference, url)
        cnt++;
      })
      page++;
    } while (cnt >= 12);
  }
  for (const cat of result.collections) {
    console.log(cat, result.items[cat].length);
  }
})();