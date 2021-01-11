const sitemapper = require("sitemapper");

(async () => {
  const sitemap = new sitemapper({
    entry: "https://gagamilano.com/sitemap.xml",
    timeout: 300000,
  });
  const d = await sitemap.fetch();
  d.sites.sort();
  d.sites.forEach(u => console.log(u));
})();