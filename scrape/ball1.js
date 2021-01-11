const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], }
  try {
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);
    if (entry.match(/shop/i)) {
      const keys = [];
      const values = [];
      result.reference = $('.ciopmodel').first().text().trim();
      result.price = $('.product-price').first().text().trim();
      result.name = $('.cioptitle').first().text().trim();
      result.thumbnail = $(".product-main--image").first().find("img").attr("src");
      $('.product-description-content').first().find('h6').each((idx, el) => {
        keys.push($(el).text().trim());
      })
      $('.product-description-content').first().find('ul').each((idx, el) => {
        const id = idx;
        $(el).find('li').each((idx, eli) => {
          const value = $(eli).text().trim();
          values.push({ id, value })
        })
      })
      values.forEach(val => {
        result.spec.push({ key: keys[val.id], value: val.value });
      })
    } else {
      result.thumbnail = $('#collectionInfoBox').find('img').first().attr('src');
      result.reference = $(".watchitem").find(".watch-no").text();
      result.name = $(".watchitem").find(".watch-title").text() + ' ' + $(".watchitem").find(".watch-type").text()
      result.collection = $(".watchitem").find(".watch-title").text();
      let key = ""; let value = "";
      $('.watch-info > p').each((idx, el) => {
        if (idx % 2 === 0) {
          key = $(el).text().trim();
        } else {
          value = $(el).text().trim();
          result.spec.push({ key, value });
        }
      })
      $('#otherviewCarousel').find('p').each((idx, el) => {
        const url = $(el).find('a').attr('href');
        const u = url.split('/');
        const ref = u[u.length - 1].split('---')[1].toUpperCase();
        result.related.push(ref);
      })
    }
  } catch (error) {
    console.error('Failed extraction for Ball with error : ' + error);
    console.error('url:', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};


(async () => {
  const eu = [
    //   //   {
    //   //     url: 'https://shop.ballwatch.ch/en/MSkindiverHeritage?model=DD3208B-S1C-BE',
    //   //     collection: 'Engineer II',
    //   //     name: 'Engineer II M Skindiver Heritage',
    //   //     reference: 'DD3208B-S1C-BE',
    //   //     price: 'SG$4,299',
    //   //     thumbnail: 'https://d23pdvlemoiqdt.cloudfront.net/cache/pbuilder_images/670/670_40098_40104_day_v1-700x1075.png',
    //   //   },
    // {
    //   url: 'https://shop.ballwatch.ch/en/CM3388D-NAVIGATOR?model=CM3388D-L-BE',
    //   collection: 'Engineer II',
    //   name: 'Engineer II Navigator World Time Chronograph',
    //   reference: 'CM3388D-L-BE',
    //   price: 'SG$4,440',
    //   thumbnail: 'https://d23pdvlemoiqdt.cloudfront.net/cache/pbuilder_images/768/768_40836_40838_day_v1-700x1075.png',
    // },
    {
      "lang": "en",
      "source": "official",
      "url": "https://www.ballwatch.com/global/en/collections/fireman---26/classic---nm2098c-sj-bk---476.html",
      "brand": "Ball",
      "brandID": 188,
      "collection": "Fireman",
      "name": "CLASSIC",
      "price": null,
      "reference": "NM2098C-SJ-BK",
    },
    {
      url: 'https://shop.ballwatch.ch/en/DM2276A-S3CJ-BE',
      collection: 'Engineer Hydrocarbon',
      name: 'Engineer Hydrocarbon Submarine Warfare',
      reference: 'DM2276A-S3CJ-BE',
      price: 'SG$3,645',
      thumbnail: 'https://d23pdvlemoiqdt.cloudfront.net/cache/catalog/products/EngineerHydrocarbon/SubmarineWarfare/DM2276A-S1CJ-BE-700x1075.jpg',
    },
    // {
    //   url: 'https://shop.ballwatch.ch/en/Submarine - DM2276A[bracelet][dial]?model=DM2276A-PCJ-BK',
    //   collection: 'Engineer Hydrocarbon',
    //   name: 'Engineer Hydrocarbon Submarine Warfare',
    //   reference: 'DM2276A-PCJ-BK',
    //   price: 'SG$3,504',
    //   thumbnail: 'https://d23pdvlemoiqdt.cloudfront.net/cache/pbuilder_images/654/654_40056_40057_day_v1-700x1075.png',
    // },
    // {
    //   url: 'https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S1CJ-BK',
    //   collection: 'Roadmaster',
    //   name: 'Roadmaster Marine GMT (40mm)',
    //   reference: 'DG3030B-S1CJ-BK',
    //   price: 'SG$3,786',
    //   thumbnail: 'https://d23pdvlemoiqdt.cloudfront.net/cache/catalog/products/Roadmaster/MarineGMTCeramic/DG3030B-S1CJ-BK-700x1075.png',
    // },
  ];

  for (let i = 0; i < eu.length; i++) {
    const ex = await extraction({
      ...eu[i],
      entry: eu[i].url,
      client: axios,
    });
    console.log(ex);
  }
})();