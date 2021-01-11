const sitemapper = require('sitemapper');
const axios = require('axios');

const indexing = async context => {
  //https://www.suunto.com/globalassets/Sitemaps/sitemap_en.xml
  //https://www.suunto.com/globalassets/Sitemaps/sitemap_en_2.xml
  //https://www.suunto.com/globalassets/Sitemaps/sitemap_en_3.xml
  //https://www.suunto.com/globalassets/Sitemaps/sitemap_index.xml
  const entry = "https://www.suunto.com/globalassets/Sitemaps/sitemap_en_2.xml";
  const sitemap = new sitemapper({
    url: entry,
    timeout: 300000,
  });
  const d = await sitemap.fetch();
  for (let i = 0; i < d.sites.length; i++) {
    if (d.sites[i].match(/product/i)) {
      // console.log(d.sites[i]);
      const { data } = await axios.get(d.sites[i]);
      const ids = data.match(/data-contentid="\w+"/ig);
      const id = ids ? ids[0].split("=")[1].replace(/"/g, "") : null;
      const link = "https://www.suunto.com/api/productbasicinfo/getitem/" + id + "/en-US";
      {
        const data = await axios.get(link);
        if (data.DigitalData && data.DigitalData.SubSections) {
          if (data.DigitalData.SubSections[0].match(/watch/i)) {
            console.log('Product : ', d.sites[i]);
          } else {
            console.log('     Not Product : ', d.sites[i]);
          }
        }

      }
    }
  }
}

(async () => {
  await indexing();
})()