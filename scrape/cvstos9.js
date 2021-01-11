const axios = require('axios');
const cheerio = require('cheerio');
const { PdfReader } = require('pdfreader');
const fs = require('fs');
const pdf = './pdf/temp.pdf';

const indexing = async context => {
  const { client, entry, base, } = context;
  const source = 'official';
  const lang = 'en';
  const brand = 'CVSTOS';
  const brandID = 186;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } }
  const w = [];

  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    $(".views-field.views-field-title").find(".field-content").find('a').each((idx, el) => {
      const href = $(el).attr('href');
      if (w.indexOf(href) < 0) {
        w.push(href);
        const url = base + href;
        const name = $(el).text();
        result.items['all'].push({
          source, lang, brand, brandID, url, name, price: null,
        })
      }
    })
    return result;
  } catch (error) {
    console.error('Failed indexing for CVSTOS with error : ', error);
    console.error('entry : ', entry);
    return {};
  }
}

const getSpec = async pdf => {
  let buffer = fs.readFileSync(pdf);
  const reader = new PdfReader();
  let txtArr = []; let prev; let page; let txt = '';
  const result = await new Promise((resolve, reject) => {
    reader.parseBuffer(buffer, (err, item) => {
      if (err) reject(err);
      else if (!item) {
        resolve(txtArr);
      } else if (item.page) {
        page = item.page;
      } else if (item.text) {
        if (prev !== item.y) {
          prev = item.y;
          if (txt) txtArr.push(txt);
          txt = 'P' + page + '...' + item.text;
        } else {
          txt = txt + item.text;
        }
      }
    });
  });
  return result;
}

const downloadPdf = async url => {
  const writer = fs.createWriteStream(pdf)
  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

const extraction = async context => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [] };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.pdf = $(".product-description-desktop .product-description-label").find('a').attr('href');
    result.name = $(".product-description-desktop .product-detail-title").text().replace(/\s+/, ' ').trim();
    result.thumbnail = $(".field-slideshow-image-1").attr("src");
    $(".product-description-desktop .product-description-content>p").each((idx, el) => {
      const key = $(el).find("strong").text();
      const value = $(el).text().replace(new RegExp(key, "i"), '').replace(/(?:\n|\s+)/g, ' ').replace(': ', '').trim();
      result.spec.push({ key, value });
    })
    if (result.pdf) {
      await downloadPdf(result.pdf)
        .then(r => getSpec(pdf))
        .then(r => {
          r.forEach(value => {
            result.spec.push({ key: 'PDF', value })
          })
        })
        .catch(e => {
          console.error('Failed processing pdf file : ', result.pdf);
          console.error('with error : ', e);
        });
    }
  } catch (error) {
    console.error('Failed extraction for CVSTOS with error', error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
}

(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://www.cvstos.com/collections/collections",
    base: "https://www.cvstos.com",
  });
  // console.log(r);
  // r.items['all'].forEach(w => console.log(w));

  // const r = {
  //   source: 'official',
  //   lang: 'en',
  //   brand: 'CVSTOS',
  //   brandID: 186,
  //   collections: ['all'],
  //   items: {
  //     'all': [
  //       {
  //         source: 'official',
  //         lang: 'en',
  //         brand: 'CVSTOS',
  //         brandID: 186,
  //         url: 'https://www.cvstos.com/collections/challenge-iii-tourbillon-eric-kuster',
  //         name: 'Challenge III Tourbillon by Eric Kuster'
  //       },
  //       {
  //         source: 'official',
  //         lang: 'en',
  //         brand: 'CVSTOS',
  //         brandID: 186,
  //         url: 'https://www.cvstos.com/collections/challenge-sealiner-chrono-yc-portofino',
  //         name: 'Challenge Sealiner Chrono YC Portofino'
  //       },
  //       {
  //         source: 'official',
  //         lang: 'en',
  //         brand: 'CVSTOS',
  //         brandID: 186,
  //         url: 'https://www.cvstos.com/collections/challenge-jetliner-ii-p-s',
  //         name: 'Challenge Jetliner II P-S'
  //       },
  //       {
  //         source: 'official',
  //         lang: 'en',
  //         brand: 'CVSTOS',
  //         brandID: 186,
  //         url: 'https://www.cvstos.com/collections/challenge-iii-chronograph-s',
  //         name: 'Challenge III Chronograph-S'
  //       }
  //     ]
  //   }
  // }
  for (let i = 0; i < r.items['all'].length; i++) {
    const ex = await extraction({
      ...r.items['all'][i],
      client: axios,
      entry: r.items['all'][i].url,
      base: 'https://www.cvstos.com',
    })
    console.log(ex.url)
    ex.spec.forEach(s => {
      console.log(s.key + ' | ' + s.value);
    })
    // process.exit(0);
  }
})();