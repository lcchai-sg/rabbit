const sitemapper = require('sitemapper');

(async () => {
  const sitemap = new sitemapper({
    url: "https://www.jomashop.com/sitemap.xml",
    timeout: 300000,
  });
  const d = await sitemap.fetch()
  d.sites.forEach(u => console.log(u));
})();