const xml2js = require('xml2js');
const client = require('axios');

(async () => {
  const entry = "https://www.hamiltonwatch.com/pub/mediam2/sitemap/sitemap_en_us.xml";
  const parser = new xml2js.Parser();
  await client.get(entry).then(resp => {
    const data = resp.data;
    parser.parseString(data, (err, res) => {
      for (let i = 1; i < res.urlset.url.length; i++) {
        if (res.urlset.url[i].priority[0] === '1.0') {
          const url = res.urlset.url[i]['loc'][0];
          const name = res.urlset.url[i]['image:image'][0]['image:title'][0];

          let d = url.split('/');
          d = d[d.length - 1].replace('.html', '');
          d = d.split('-');
          let reference = '';
          if (d[0].match(/h[0-9]{8}/)) {
            reference = d[0].toUpperCase();
          } else {
            let r = d[d.length - 1].replace('.html', '');
            if (r.match(/h[0-9]{8}/)) {
              reference = r.toUpperCase();
            } else {
              reference = 'noRef' + i;
            }
          }

          console.log(reference, url);
        }
      }
    });
  });
  process.exit(0)
})();
