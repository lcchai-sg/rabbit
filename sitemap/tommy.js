const axios = require('axios');
const cheerio = require('cheerio');
const fetchUrl = require('fetch').fetchUrl;

(async () => {
  const urls = [
    'https://usa.tommy.com/en/accessories-mens-watches-cufflinks',
    'https://usa.tommy.com/en/women-watches-jewelry',
  ];

  const entry = "https://usa.tommy.com/static/sitemap.xml";

  const w = [
    "https://usa.tommy.com/en/tommy-jeans-neon-digital-watch-1791675",
    "https://usa.tommy.com/en/tommy-jeans-pink-digital-watch-1791676",
    "https://usa.tommy.com/en/sport-dress-watch-with-leather-band-1791391",
    "https://usa.tommy.com/en/slim-sport-watch-with-croc-embossed-black-leather-strap-1791339",
    "https://usa.tommy.com/en/casual-sport-watch-1791276",
    "https://usa.tommy.com/en/sport-watch-with-silicon-strap-1791326",
    "https://usa.tommy.com/en/multi-eye-watch-with-black-dial-1791488",
    "https://usa.tommy.com/en/sport-watch-1790775",
    "https://usa.tommy.com/en/women/women-watches-jewelry/blush-monochrome-dress-watch-1781957",
    "https://usa.tommy.com/en/women/women-watches-jewelry/white-monochrome-dress-watch-1781956",
    "https://usa.tommy.com/en/women/women-watches-jewelry/casual-watch-with-mesh-bracelet-1782152",
    "https://usa.tommy.com/en/women/women-watches-jewelry/pave-crystal-dress-watch-with-leather-strap-1782111",
    "https://usa.tommy.com/en/women/women-watches-jewelry/gold-plated-sport-watch-with-navy-silicone-strap-1782198",
    "https://usa.tommy.com/en/men/accessories-mens-watches-cufflinks/sub-dials-stainless-steel-watch-with-mesh-bracelet-1710396",
  ];

  // for (let i = 0; i < 1; i++) {
  for (let i = 0; i < w.length; i++) {
    console.log(w[i]);
    let result = {};
    const v = w[i].split('/');
    const n = v[v.length - 1].split('-');
    result.reference = n[n.length - 1];
    result.name = n.slice(0, n.length - 1).join(' ');

    const data = await new Promise((resolve, reject) => {
      fetchUrl(w[i], { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' } },
        (err, res, body) => {
          if (err) reject(err);
          resolve(body.toString());
        }
      )
    });
    const $ = cheerio.load(data);
    result.name = $('.productNameInner').text().trim();
    result.thumbnail = $('.product_main_image').find('img').attr('data-src');
    result.price = $('#price_display').text().trim();
    result.description = $('.itemDescription>p').first().text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.gender = result.description.match(/women/i) ? 'F' : 'M';
    result.spec = [];
    const spec = $('.productBullets').first().text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().replace('Description  ', '').replace('  Fabric & Care  ', '');
    if (spec) {
      let sp = [];
      if (spec.match(/\d+\.\d+/)) {
        sp = [spec];
      } else {
        sp = spec.split('.');
      }
      sp.forEach(v => {
        const s = v.split(',');
        s.forEach(v => {
          if (v.indexOf('.') > 0 && !(v.match(/\d+\.\d+/))) {
            const ss = v.split('.');
            ss.forEach(v => v && result.spec.push(v.trim()))
          } else {
            v && result.spec.push(v.trim())
          }
        })
      })
    } else {
      console.log('no spec found');
      const spec = result.description.split('•');
      for (let k = 1; k < spec.length; k++) {
        const sp = spec[k].split(',');
        sp.forEach(s => {
          if (s) result.spec.push(s.trim())
        })
      }
    }
    // result.spec = spec.split('.').filter(v => v !== '')
    console.log(result);
    await new Promise((r) => setTimeout(r, 5000))
  }
  // let data = await new Promise((resolve, reject) => {
  //   fetchUrl(entry, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' } },
  //     (err, res, body) => {
  //       if (err) reject(err);
  //       resolve(body.toString());
  //     }
  //   )
  // });
  // const $ = cheerio.load(data);
  // const result = [];
  // $('loc').each((idx, el) => {
  //   const url = $(el).text();
  //   if (url.match(/watch/i) && !(url.match(/watches/i))) {
  //     const splitUrl = url.split('/');
  //     const nameRef = splitUrl[splitUrl.length - 1].split('-');
  //     const reference = nameRef[nameRef.length - 1];
  //     const name = nameRef.slice(0, nameRef.length - 1).join(' ');
  //     result.push({
  //       url,
  //       name,
  //       reference,
  //     });
  //   }
  // })
  // console.log(result);

  // await new Promise((resolve, reject) => {
  //   fetchUrl(entry, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' } },
  //     (err, res, body) => {
  //       if (err) reject(err);
  //       const data = body.toString();
  //       const $ = cheerio.load(data);
  //       const result = [];
  //       $('loc').each((idx, el) => {
  //         const url = $(el).text();
  //         if (url.match(/watch/i) && !(url.match(/watches/i))) {
  //           const splitUrl = url.split('/');
  //           const nameRef = splitUrl[splitUrl.length - 1].split('-');
  //           const reference = nameRef[nameRef.length - 1];
  //           const name = nameRef.slice(0, nameRef.length - 1).join(' ');
  //           result.push({
  //             url,
  //             name,
  //             reference,
  //           });
  //         }
  //       })
  //       console.log('result.............');
  //       console.log(result);
  //       resolve(result);
  //     }
  //   )
  // })

  console.log('***** completed *****')

})();