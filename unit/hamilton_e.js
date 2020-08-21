
const client = require('axios');
const cheerio = require('cheerio');

const extract = data => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].indexOf('@type') >= 0) {
      const d = data[i].replace(",", "").split(':');
      if (d[1] === ' "Product"') return true;
    }
  }
  return false;
}

const clean = data => {
  return data.replace('",', '').replace('"', '').trim();
}

(async () => {
  //us
  // const entry = "https://www.hamiltonwatch.com/en-us/h64735561-khaki-pilot-schott.html";
  //hk
  // const entry = "https://www.hamiltonwatch.com/zht-hk/h64735561-khaki-pilot-schott.html";
  //jp
  // const entry = "https://www.hamiltonwatch.com/ja-jp/h64735561-khaki-pilot-schott.html";
  //cn
  // const entry = "https://www.hamiltonwatch.com/zhs-cn/h38525121-jazzmaster.html";
  //sg
  // const entry = "https://www.hamiltonwatch.com/en-sg/h64735561-khaki-pilot-schott.html";

  const result = {
    url: entry,
    reference: "",
    scripts: [],
    spec: [],
    related: []
  };

  const d = (await client.get(entry)).data;
  const $ = cheerio.load(d);

  /* other market */
  /*
  $('script').each((_, el) => {
    let ty = $(el).attr('type');
    if (ty == 'application/ld+json') {
      let data = $(el).contents()
      let dd = data['0']['data'].replace('\t', '').split('\n')
      if (extract(dd)) {
        for (let i = 0; i < dd.length; i++) {
          const d = dd[i].split(':');
          if (d.length >= 2) {
            const f = d[0].trim();
            switch (f) {
              case '"name"':
                (!result.name) ? result.name = clean(d[1]) : null;
                break;
              case '"description"': result.description = clean(d[1]); break;
              case '"image"': result.image = clean(d[1]) + ":" + clean(d[2]); break;
              case '"sku"': result.reference = clean(d[1]); break;
              case '"gtin13"': result.gtin13 = clean(d[1]); break;
              case '"priceCurrency"': result.currency = clean(d[1]); break;
              case '"price"': result.price = result.retail = parseFloat(clean(d[1])); break;
            }
          }
        }
      }
    }
  })

  // us market
  */
  $('script').each((_, el) => {
    let ty = $(el).attr('type');
    if (ty == 'application/ld+json') {
      let data = $(el).contents();
      data = data['0']['data'];
      data = data.replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      data = JSON.parse(data);
      if (data['@type'] === 'Product') {
        result.name = data.name;
        result.description = data.description;
        if (typeof data.image === 'string') {
          result.thumbnail = data.image;
        } else {
          result.thumbnail = data.image[0];
        }
        result.reference = data.sku;
        result.gtin13 = data.gtin13;
        result.currency = data.offers.priceCurrency;
        result.price = result.retail = data.offers.price;
      }
    }
  });

  // // us market
  // $('meta').each((idx, el) => {
  //   const data = $(el).attr('content');
  //   const field = $(el).attr('property');
  //   switch (field) {
  //     case 'og:title': result.name = data; break;
  //     case 'og:description': result.description = data; break;
  //     case 'og:image': result.thumbnail = data; break;
  //     case 'product:price:amount': result.retail = result.price = parseFloat(data); break;
  //     case 'product:price:currency': result.currency = data; break;
  //     default: break;
  //   }
  // });



  $('tr').each((idx, el) => {
    const key = $(el).find('.data').attr('data-th');
    const value = $(el).find('.data').text().trim();
    result.spec.push({
      key,
      value,
    })
  })

  console.log("result >", result)
})();
