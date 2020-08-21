const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

(async () => {
  const sites = [
    "https://www.jomashop.com/01-exclusive-offers-deal.html",
    "https://www.jomashop.com/02-exclusive-offers-deal.html",
    "https://www.jomashop.com/03-exclusive-offers-deal.html",
    "https://www.jomashop.com/04-exclusive-offers-deal.html",
    "https://www.jomashop.com/05-exclusive-offers-deal.html",
    "https://www.jomashop.com/056-001.html",
    "https://www.jomashop.com/056-002.html",
    "https://www.jomashop.com/056-006.html",
    "https://www.jomashop.com/056-007.html",
    "https://www.jomashop.com/056-009.html",
    "https://www.jomashop.com/925-couture-18k-gold-plated-bronze-amethyst-pendant-18.html",
    "https://www.jomashop.com/925-couture-18k-gold-plated-silver-smokey-quartz-cognac-quartz-pendant-18.html",
    "https://www.jomashop.com/925-couture-18k-gold-plated-sterling-silver-bean-necklace-18.html",
    "https://www.jomashop.com/925-couture-18k-gold-plated-sterling-silver-genuine-rose-quartz-and-created-white-sapphire-ring.html",
    "https://www.jomashop.com/925-couture-18k-gold-plated-sterling-silver-multi-gemstone-necklace-16-2.html",
    "https://www.jomashop.com/a-line-watch-al-80014-rg-22.html",
    "https://www.jomashop.com/a-line-watch-al-80014-yg-22.html",
    "https://www.jomashop.com/a-line-watch-al-80016-yg-22.html",
    "https://www.jomashop.com/a-line-watch-al-80020-bb-11mop.html",
    "https://www.jomashop.com/a-line-watch-al-80021-rg-22.html",
  ];

  // for (let i = 0; i < sites.length; i++) {
  //   console.log(i, new Date())
  //   const d = (await axios.get(sites[i])).data;
  //   const $ = cheerio.load(d);
  //   $('.wrapper .page .breadcrumbs').each((idx, el) => {
  //     if (idx === 0) {
  //       breadcrumbs = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
  //       console.log('breadcrumbs >>>>>', breadcrumbs);
  //       if (breadcrumbs.match(/watches/i)) console.log(sites[i], 'WATCH')
  //     }
  //   })
  //   console.log(i, new Date())
  //   await new Promise(r => setTimeout(r, 5000));
  // }

  const brands = "https://www.jomashop.com/brands.html";
  const d = (await axios.get(brands)).data;
  const $ = cheerio.load(d);
  $('.brand-index-name').each((idx, el) => {
    const bname = $(el).attr('title');
    const ref = $(el).attr('href');
    let brand = ref.split('/')
    brand = brand[brand.length - 1].replace('-watches.html', '');
    console.log(idx, bname, brand, ref);
  })
})();

