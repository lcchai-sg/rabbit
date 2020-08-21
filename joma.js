const Sitemapper = require('sitemapper');

(async () => {
  try {
    const lang = 'en';
    const entry = "https://www.jomashop.com/sitemap.xml";
    const result = [];
    let payload = { source: 'jomashop', lang, collections: ['all'], items: { 'all': [], } };
    payload.items['all'] = [];
    let sitemap = new Sitemapper({
      url: entry,
      timeout: 300000,
    });
    let data = await sitemap.fetch();
    let cnt = 0;
    for (let i = 0; i < data.sites.length; i++) {
      if (data.sites[i].match(/-watch-/i)) {
        let u = data.sites[i].split('/');
        let d = u[u.length - 1].split('-watch-');
        payload.items['all'].push({
          url: data.sites[i],
          name: d[1].replace('.html', '').replace('-', ' '),
          brand: d[0].replace('-', ' '),
          reference: d[1].replace('.html', '').replace('-', '.'),
          price: null,
        });
        cnt++;
        if (cnt % 500 === 0) {
          result.push({ payload });
          payload = { source: 'jomashop', lang: "en", collections: ['all'], items: { 'all': [], } };
          payload.items['all'] = [];
        }
      }
    }
    if (payload.items['all'].length > 0) {
      result.push({ payload });
    }
    for (const r of result) {
      for (const p of r.payload.items['all']) {
        console.log(p.url);
      }
    }
    process.exit(0)
  } catch (error) {
    console.error('Failed indexing for Jomashop with error : ' + error)
    process.exit(1)
  }
})();
