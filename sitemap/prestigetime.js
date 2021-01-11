const sitemapper = require('sitemapper');

(async () => {
  const sitemap = new sitemapper({
    url: "https://www.prestigetime.com/sitemap.xml",
    timeout: 300000,
  });

  const sm = await sitemap.fetch();
  sm.sites.sort()
  sm.sites.forEach(v => console.log(v));
})();