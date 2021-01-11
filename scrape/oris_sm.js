const sitemapper = require('sitemapper');

(async () => {
  const sitemap = new sitemapper({
    url: "https://www.oris.ch/en/sitemap.xml",
    timeout: 300000,
  });
  const d = await sitemap.fetch();
  d.sites.sort();
  d.sites.forEach(v => console.log(v));
})();