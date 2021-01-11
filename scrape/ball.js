const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');

const collections = [
  'Official Railroad Watch',
  'Engineer II',
  'Engineer III',
  'Engineer M',
  'Engineer Master II',
  'Engineer Hydrocarbon',
  'Trainmaster',
  'Conductor',
  'Fireman',
  'Roadmaster'
];

const index1 = async entry => {
  const result = { collections: [], items: {} };
  const { data } = await axios.get(entry);
  const $ = cheerio.load(data);

  $('.sitemap-list.col1-4').each((idx, el) => {
    const collection = $(el).find('.sitemap-list-title').text().trim();
    // const coll_url = $(el).find('a').attr('href');
    if (result.collections.indexOf(collection) < 0) {
      result.collections.push(collection);
      result.items[collection] = [];
    }
    $(el).find('li').each((idx, el) => {
      const name = $(el).text().trim().toUpperCase();
      const url = $(el).find('a').attr('href');
      const u = url.split('/');
      const nref = u[u.length - 1].split('---');
      // const name1 = nref[0].replace(new RegExp('-', 'g'), ' ').toUpperCase();
      const ref = nref[1].toUpperCase();
      const reference = (ref[0] === '-') ? ref.slice(1, ref.length) : ref;
      result.items[collection].push({
        url, collection, name, reference,
      });
    })
  })

  return result;
}

const index4 = async entry => {
  const result = { collections: [], items: {} };
  collections.forEach(val => {
    result.collections.push(val);
    result.items[val] = [];
  })
  result.collections.push('others');
  result.items['others'] = [];

  const { data } = await axios.get(entry);
  const $ = cheerio.load(data);
  const lastp = $('.pagination').find('li').last().find('a').attr('href');
  const lastpage = parseInt(lastp.match(/\d{1,3}/g));
  const entry1 = "https://shop.ballwatch.ch/en/watchfinder?page=";
  for (let i = 1; i <= lastpage; i++) {
    const link = entry1 + i;
    console.log(link);
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    $('.col-6.col-lg-4').each((idx, el) => {
      const url = $(el).find('a').attr('href');
      const name = $(el).find('.wic--name').text();
      let collection = 'others';
      collections.forEach(val => {
        if (name.match(new RegExp(val, 'i'))) {
          collection = val;
        }
      })
      if (!(name.match(/strap/i))) {
        let reference = '';
        if (url.match(/model=/i)) {
          reference = url.split('model=')[1].toUpperCase();
        } else {
          const u = url.split('/');
          const r = u[u.length - 1].split('-');
          if (r.length === 4)
            reference = (r[1] + '-' + r[2] + '-' + r[3]).toUpperCase();
          else if (r.length === 3)
            reference = (r[0] + '-' + r[1] + '-' + r[2]).toUpperCase();
          else
            reference = r.join('-');
        }

        const thumbnail = $(el).find('img').attr('src');
        const price = $(el).find('.wic--price').text();
        result.items[collection].push({
          collection, url, name, reference, price, thumbnail,
        })
      }
    })
  }
  return result;
}

const extract1 = async entry => {
  const { url, collection, name, reference, price, thumbnail, } = entry;
  const result = { url, collection, name, reference, price, thumbnail, spec: [], related: [], };
  const { data } = await axios.get(url);
  const $ = cheerio.load(data)
  result.thumbnail = $('#collectionInfoBox').find('img').first().attr('src');
  // extract name, reference, price, thumbnail, ...
  let key = "";
  let value = "";
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
  return result;
}

const extract4 = async entry => {
  const { url, collection, name, reference, price, thumbnail, } = entry;
  const result = { url, collection, name, reference, price, thumbnail, spec: [], related: [], };
  const { data } = await axios.get(url);
  const $ = cheerio.load(data)
  const keys = [];
  const values = [];
  result.reference = $('.ciopmodel').first().text().trim();
  // result.price = $('.product-price').first().text().trim();
  // result.name = $('.cioptitle').first().text().trim();
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
  return result;
}

(async () => {
  const mdb = {
    host: "127.0.0.1",
    port: 27017,
    user: 'synopsis',
    pass: 'synopsis',
    name: 'synopsis',
    coll: 'ball_urls',
  };

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true, useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  const url1 = 'https://www.ballwatch.com/global/en/sitemap.html';
  const url2 = 'https://www.ballwatch.com/global/en/collections.html';
  // url1 === url2
  const url3 = 'https://shop.ballwatch.ch/en/';
  const url4 = 'https://shop.ballwatch.ch/en/watchfinder';
  const url5 = 'https://shop.ballwatch.ch/en/collections';

  const r1 = await index1(url1);
  for (const col of r1.collections) {
    let cnt = 0;
    for (const item of r1.items[col]) {
      console.log(col, cnt)
      const ex = await extract1(item);
      // console.log(ex);
      await db.collection(mdb.coll).insertOne(ex);
      cnt++;
    }
  }
  const r4 = await index4(url4);
  for (const col of r4.collections) {
    let cnt = 0;
    for (const item of r4.items[col]) {
      console.log(col, cnt)
      const ex = await extract4(item);
      // console.log(ex);
      await db.collection(mdb.coll).insertOne(ex);
      cnt++;
    }
  }

  // const eu = [
  //   //   {
  //   //     url: 'https://shop.ballwatch.ch/en/MSkindiverHeritage?model=DD3208B-S1C-BE',
  //   //     collection: 'Engineer II',
  //   //     name: 'Engineer II M Skindiver Heritage',
  //   //     reference: 'DD3208B-S1C-BE',
  //   //     price: 'SG$4,299',
  //   //     thumbnail: 'https://d23pdvlemoiqdt.cloudfront.net/cache/pbuilder_images/670/670_40098_40104_day_v1-700x1075.png',
  //   //   },
  //   //   {
  //   //     url: 'https://shop.ballwatch.ch/en/CM3388D-NAVIGATOR?model=CM3388D-L-BE',
  //   //     collection: 'Engineer II',
  //   //     name: 'Engineer II Navigator World Time Chronograph',
  //   //     reference: 'CM3388D-L-BE',
  //   //     price: 'SG$4,440',
  //   //     thumbnail: 'https://d23pdvlemoiqdt.cloudfront.net/cache/pbuilder_images/768/768_40836_40838_day_v1-700x1075.png',
  //   //   },
  //   {
  //     url: 'https://shop.ballwatch.ch/en/DM2276A-S3CJ-BE',
  //     collection: 'Engineer Hydrocarbon',
  //     name: 'Engineer Hydrocarbon Submarine Warfare',
  //     reference: 'DM2276A-S3CJ-BE',
  //     price: 'SG$3,645',
  //     thumbnail: 'https://d23pdvlemoiqdt.cloudfront.net/cache/catalog/products/EngineerHydrocarbon/SubmarineWarfare/DM2276A-S1CJ-BE-700x1075.jpg',
  //   },
  //   {
  //     url: 'https://shop.ballwatch.ch/en/Submarine - DM2276A[bracelet][dial]?model=DM2276A-PCJ-BK',
  //     collection: 'Engineer Hydrocarbon',
  //     name: 'Engineer Hydrocarbon Submarine Warfare',
  //     reference: 'DM2276A-PCJ-BK',
  //     price: 'SG$3,504',
  //     thumbnail: 'https://d23pdvlemoiqdt.cloudfront.net/cache/pbuilder_images/654/654_40056_40057_day_v1-700x1075.png',
  //   },
  //   {
  //     url: 'https://shop.ballwatch.ch/en/Marine_GMT-DG3030B-S1CJ-BK',
  //     collection: 'Roadmaster',
  //     name: 'Roadmaster Marine GMT (40mm)',
  //     reference: 'DG3030B-S1CJ-BK',
  //     price: 'SG$3,786',
  //     thumbnail: 'https://d23pdvlemoiqdt.cloudfront.net/cache/catalog/products/Roadmaster/MarineGMTCeramic/DG3030B-S1CJ-BK-700x1075.png',
  //   },
  // ];

  // for (let i = 0; i < eu.length; i++) {
  //   const ex = await extract4(eu[i]);
  //   console.log(ex);
  // }

  console.log('*** completed ***')
  process.exit(0)
  // await index4(url4);
})();