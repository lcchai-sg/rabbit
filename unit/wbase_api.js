const axios = require('axios');

const _indexing = (context) => {
  try {
    return new Observable(observer => {
      const { client, lang } = context;
      const urls = [];
      const brands = "http://api.watchbase.com/v1/brands?key=B4PMCSMEXeGo1c0Lpk5HmEQw2bKhSqaIwzhuJ9cy&format=json";

      client.get(brands).then(res => {

      });

      client.get(sitemap).then(res => {
        const data = res.data;
        parser.parseString(data, (err, result) => {
          for (let i = 1; i < result.sitemapindex.sitemap.length; i++) {
            urls.push(result.sitemapindex.sitemap[i].loc[0]);
          }
        });
        for (let i = 0; i < urls.length - 1; i++) {
          const results = [];
          const source_url = urls[i];
          logger.debug(source_url);
          client.get(source_url).then(res => {
            const data = res.data;
            parser.parseString(data, (err, res) => {
              for (let i = 0; i < res.urlset.url.length; i++) {
                const url = res.urlset.url[i].loc[0];
                let thumbnail = '';
                if (res.urlset.url[i]['image:image']) {
                  thumbnail = res.urlset.url[i]['image:image'][0]['image:loc'][0];
                }
                // if (url.match(/watch/i) || thumbnail.match(/watch/i)) {
                results.push({
                  url,
                  source: 'jomashop',
                  thumbnail,
                  lang,
                  source_url: source_url,
                });
                // }
              }
            });
            observer.next({ ...context, results });
            // observer.complete();
          });
        }
      })
    });
  } catch (error) {
    logger.error('Failed for indexing(xml) class of Jomashop with error : ' + error);
    return new Observable(o => o.error(error));
  }
}



(async () => {
  const brands = "http://api.watchbase.com/v1/brands?key=B4PMCSMEXeGo1c0Lpk5HmEQw2bKhSqaIwzhuJ9cy&format=json";
  //"http://api.watchbase.com/v1/families?key=B4PMCSMEXeGo1c0Lpk5HmEQw2bKhSqaIwzhuJ9cy&format=json&brand-id=59";
  const collections = "http://api.watchbase.com/v1/families?key=B4PMCSMEXeGo1c0Lpk5HmEQw2bKhSqaIwzhuJ9cy&format=json&brand-id=";
  //"http://api.watchbase.com/v1/watches?key=B4PMCSMEXeGo1c0Lpk5HmEQw2bKhSqaIwzhuJ9cy&format=json&brand-id=59"
  const watches = "http://api.watchbase.com/v1/watches?key=B4PMCSMEXeGo1c0Lpk5HmEQw2bKhSqaIwzhuJ9cy&format=json&brand-id=";
  const watch = "http://api.watchbase.com/v1/watch?key=B4PMCSMEXeGo1c0Lpk5HmEQw2bKhSqaIwzhuJ9cy&format=json&id=17289";

  // const data = (await axios.get(brands)).data;
  // const b = data.brands;
  // for (let i = 0; i < b.length; i++) {
  //   const wlink = watches + b[i].id;
  //   console.log('watches >', wlink)
  //   const data = (await axios.get(wlink)).data;
  //   const w = data.watches;
  //   for (let j = 0; j < w.length; j++) {
  //     results.push({
  //       brandId: b[i].id,
  //       brand: b[i].name,
  //       id: w[j].id,
  //       reference: w[j].refnr,
  //       name: w[j].name,
  //       collectionId: w[j].family.id,
  //       collection: w[j].family.name,
  //       thumbnail: w[j].thumb,
  //     });
  //   }
  //   results.forEach(val => console.log(val));
  // }

  axios.get(brands).then(res => {
    const b = res.data.brands;
    for (let i = 0; i < 5; i++) {
      const results = [];
      const wlink = watches + b[i].id;
      console.log(`watches ${wlink}`);
      axios.get(wlink).then(res => {
        const w = res.data.watches;
        for (let j = 0; j < 10; j++) {
          results.push({
            brandId: b[i].id,
            brand: b[i].name,
            id: w[j].id,
            reference: w[j].refnr,
            name: w[j].name,
            collectionId: w[j].family.id,
            collection: w[j].family.name,
            thumbnail: w[j].thumb,
          });
        }
        results.forEach(val => console.log(val))
        new Promise(r => setTimeout(r, 5000)).then(res => { })
      });
    }
    // process.exit(0)
  });


})();