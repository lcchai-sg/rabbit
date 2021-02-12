const sitemapper = require('sitemapper');

const indexing = async context => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Burberry";
  const brandID = 344;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
  try {
    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    })
    const d = await sitemap.fetch();
    d.sites.sort();
    d.sites.forEach(u => {
      console.log(u)
    })
    return result;
  } catch (error) {
    console.error('Failed indexing for Burberry with error : ', error);
    return {}
  }
}

(async () => {
  const r = await indexing({
    entry: "https://row.burberry.com/sitemap-row.xml",
    base: "https://www.burberry.com/",
  });
  console.log(r);
})();