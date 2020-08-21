const Sitemapper = require('sitemapper');

(async () => {
  try {
    let url = 'https://www.midowatches.com/us/sitemap.xml';
    let timeout = 300000;

    let sitemap = new Sitemapper({ url, timeout, });
    let data = await sitemap.fetch();
    data.sites.sort();
    let cnt = 0;
    for (const site of data.sites) {
      if (site.match('/swiss-watches-collections/') && site.split('/').length === 7) {
        const a = site.split('/');
        console.log(site, a.length);
        cnt++;
      }
    }
    console.log('number of watches =>', cnt)
  } catch (error) {
    console.log(error);
  }
})();
