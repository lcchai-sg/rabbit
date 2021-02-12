const sitemapper = require('sitemapper');

const indexing = async context => {
    const { entry, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Fossil";
    const brandID = 350;
    const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
    const sitemap = new sitemapper({
        url: entry,
        timeout: 300000,
    });
    const d = await sitemap.fetch();
    d.sites.sort().forEach(url => {
        if (url.match(/-watch\b/i) && !(url.match(/watch-strap/i))) {
            const u = url.split('/');
            const reference = u[u.length - 1].replace(".html", "").trim();
            const name = u[u.length - 2].split("-").join(" ").toUpperCase();
            result.items['all'].push({
                source, lang, brand, brandID, url, name, reference, retail: null,
            })
        }
    })
    return result;
}

(async () => {
    const r = await indexing({
        entry: "https://www.fossil.com/en-us/sitemap_index.xml",
        base: "https://www.fossil.com/en-us",
    });
    r.items['all'].forEach(w => console.log(w));
})();