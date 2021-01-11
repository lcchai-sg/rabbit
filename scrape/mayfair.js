const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
  const source = "watchesofmayfair";
  const lang = "en";
  let { client, entry, } = context;
  const result = [];
  let payload = { source, lang, collections: ['all'], items: { 'all': [], } };
  let next = entry;

  do {
    console.log(next);
    const { data } = await client.get(next);
    const $ = cheerio.load(data);
    $(".item.product.product-item").each((idx, el) => {
      const url = $(el).find('a').attr('href');
      const thumbnail = $(el).find('img').attr('src');
      const reference = $(el).find('.span-productid').text();
      const name = $(el).find('.product-item-link').text();
      const price = $(el).find(".price-wrapper.price-including-tax").text();
      const retail = $(el).find(".price-wrapper.price-excluding-tax").text();
      // console.log({ url, thumbnail, name, reference, price, retail })
      payload.items['all'].push({
        url, thumbnail, name, reference, price, retail,
      })
    })
    next = $('.pages-item-next').find('a').attr('href');
  } while (next);
};

(async () => {
  const r = await indexing({
    client: axios,
    // entry: "https://watchesofmayfair.com/watches",
    entry: "https://watchesofmayfair.com/watches?product_list_limit=59",
  });
  console.log(r);
})();