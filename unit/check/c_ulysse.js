const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.un-c-megaMenu__sub-menu li a').each((idx, el) => {
      if (idx < 5) {
        const name = $(el).text().trim();
        const url = $(el).attr('href');
        result.collections.push(name);
        result.items[name] = [];
        cats.push({ name, url });
      }
    });
    cats.shift();
    for (const cat of cats) {
      console.log(cat.url)
      const d = (await client.get(cat.url)).data;
      const $$ = cheerio.load(d);
      const amount = $$('.un-c-filter__total').text().replace('Watches', '').trim();
      console.log('amount>', amount)
      const PAGE = Math.ceil(parseInt(amount) / 9);
      if (PAGE > 1) {
        let current = 1;
        do {
          const link = cat.url + ((current > 0) ? '?p=' + current : '?p=1');
          const $$ = cheerio.load((await client.get(link)).data);
          $$('.un-c-product.product-item').each((idx, el) => {
            const url = $$(el).find('.un-c-product__item a').attr('href');
            const thumbnail = $$(el).find('.un-c-product__item a img').attr('src');
            const name = $$(el).find('.product-item-link').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const retail = $$(el).find('.price-box.price-final_price').text().trim();
            let reference = '';
            const words = url.split('/');
            for (const word of words) {
              if (word.match(/html/i)) {
                reference = word.replace('.html', '');
              }
            }
            result.items[cat.name].push({
              source: 'official',
              url,
              thumbnail,
              collection: cat.name,
              name,
              reference,
              retail
            });
          });
          current++;
          return result;
        }
        while (current < (PAGE + 1))
      } else {
        const $$ = cheerio.load((await client.get(cat.url)).data);
        $$('.un-c-product.product-item').each((idx, el) => {
          const url = $$(el).find('.un-c-product__item a').attr('href');
          const thumbnail = $$(el).find('.un-c-product__item a img').attr('src');
          const name = $$(el).find('.product-item-link').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
          const retail = $$(el).find('.price-box.price-final_price').text().trim();
          let reference = '';
          const words = url.split('/');
          for (const word of words) {
            if (word.match(/html/i)) {
              reference = word.replace('.html', '');
            }
          }
          result.items[cat.name].push({
            url,
            thumbnail,
            collection: cat.name,
            name,
            reference,
            retail
          });
        });
        return result;
      }
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Ulysse with error : ' + error);
    return [{ collections: [], items: {} }];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry } = context;
    const result = {
      url: entry,
      scripts: [],
      spec: [],
      related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.col-md-12.text-center.text-md-left h2').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    $('.price-box.price-final_price').each((idx, el) => {
      if (idx === 0) {
        result.retail = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      }
    });
    result.reference = $('.text-center.text-md-left.text-secondary.small').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.gender = 'M'
    $('.d-flex.flex-wrap.small.no-gutters .mt-4 ').each((idx, el) => {
      const key = $(el).find('span').text();
      const value = $(el).text().replace(key, '').trim();
      if (value) {
        result.spec.push({ key, value });
      }
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Ulysse with error : ' + error);
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.ulysse-nardin.com/row_en/",
    base: "https://www.ulysse-nardin.com/",
  };
  const r = await indexing(context);
  console.log(r)
  if (r) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.ulysse-nardin.com/row_en/1183-310-43.html",
      base: "https://www.ulysse-nardin.com/",
    }
    const e = await extraction(context);
    if (e.spec && e.spec.length > 0) {
      console.log(e)
    } else {
      console.log('extraction failed...')
    }
  } else {
    console.log('indexing failed...')
  }
})();
