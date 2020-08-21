const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, } = context;
    const result = [];
    // 0 - 5 = 5 pages * 59 items = 295 items
    let count = 0;
    const PAGE = 5;
    do {
      count++;
      const link = entry + '?p=' + count + '&product_list_limit=59';
      console.debug(link)
      const $ = cheerio.load((await client.get(link)).data);
      $('.item.product.product-item').each((idx, el) => {
        const url = $(el).find('.product-btn a').attr('href');
        const name = $(el).find('.product-item-link').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const thumbnail = $(el).find('.product-image-wrapper img').attr('src');
        const price = $(el).find('.price-wrapper.price-including-tax').attr('data-price-amount');
        const fixedPrice = Math.round(price * 100) / 100;
        result.push({
          source: 'watchesofmayfair',
          url,
          name,
          price: '$' + fixedPrice,
          thumbnail,
        })
      });
      return result;
    }
    while (count < PAGE)
    return result;
  } catch (error) {
    console.error('Failed for indexing class of Mayfair with error : ' + error)
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, } = context;
    const result = {
      url: entry,
      scripts: [],
      spec: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.reference = $('.col.data.reference-value').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.name = $('.page-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.price-container.price-msrp_price .price-wrapper ').text().trim();
    result.brand = $('.col.data.manufacturer-value ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $('.product.attribute.overview .value').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    // result.brandID = Mappers.generateBrandID.map(result.brand);
    let breadcrumbs = '';
    let words = [];
    $('.breadcrumbs .items li').each((idx, el) => {
      breadcrumbs = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      words.push(breadcrumbs);
    });
    if (words.length > 0) {
      if (words[1].indexOf(/brands/i) === -1) {
        if (words[5]) {
          result.collection = words[3];
          result.subcollection = words[4];
        }
        else {
          result.collection = words[3];
        }
      }
    }

    $('.data.table.additional-attributes tr').each((idx, el) => {
      const key = $(el).find('th').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('td').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.error('Failed extraction for Watches of May Fair with error : ' + error);
    return [];
  }
};


(async () => {
  const context = {
    entry: "https://watchesofmayfair.com/watches/all-watches",
    base: "https://watchesofmayfair.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r) {
    const context = r[0];
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
