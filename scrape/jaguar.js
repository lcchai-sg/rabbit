const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Jaguar";
  const brandID = 362;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
  try {
    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    });
    const d = await sitemap.fetch();
    d.sites.forEach(url => {
      if (url.match(/\/watches\//i)) {
        const ref = url.split("/");
        const reference = ref[ref.length - 2].replace(/-/g, '/').toUpperCase();
        result.items['all'].push({
          source, lang, brand, brandID, url, reference, retail: null,
        })
      }
    })
    return result;
  } catch (error) {
    console.error('Failed indexing for Jaguar with error : ', error);
    return {};
  }
}

const extraction = async context => {
  const { client, entry, base, ...rest } = context;
  if (!rest || !rest.source) rest.source = "official";
  if (!rest || !rest.lang) rest.lang = "en";
  if (!rest || !rest.brand) rest.brand = "Jaguar";
  if (!rest || !rest.brandID) rest.brandID = 362;
  const result = { ...rest, url: entry, spec: [], };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.name = $(".text-box-portfolio").find("h2").text();
    result.reference = result.name.split(" ")[0];
    result.gender = $(".subtitulo-portfolio").text();
    result.thumbnail = $(".wpb_single_image").find("img").attr("src");
    $(".text-box-portfolio").find("p").each((idx, el) => {
      const val = $(el).text();
      const key = $(el).find("strong").text();
      if (key) {
        const value = val.split(":")[1].replace(/\t/g, '').trim();
        result.spec.push({ key, value });
      }
    })
    const href = $(".text-box-portfolio").find("a").attr("href");
    const fam = href.split("/");
    result.collection = fam[fam.length - 1].toUpperCase();
  } catch (error) {
    console.error('Failed extraction for Jaguar with error : ', error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = "UNKNOWN ERROR";
  }
  return result;
}

(async () => {
  const r = await indexing({
    entry: "https://jaguarswisswatches.com/sitemap.xml",
    base: "https://jaguarswisswatches.com",
  })
  // r.items['all'].forEach(w => console.log(w));
  // console.log(r.items['all'].length)

  // const rr = [
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Jaguar',
  //     brandID: 362,
  //     url: 'https://jaguarswisswatches.com/watches/j695-2/',
  //     reference: 'J695/2',
  //     retail: null
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Jaguar',
  //     brandID: 362,
  //     url: 'https://jaguarswisswatches.com/watches/j696-1/',
  //     reference: 'J696/1',
  //     retail: null
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Jaguar',
  //     brandID: 362,
  //     url: 'https://jaguarswisswatches.com/watches/j697-1/',
  //     reference: 'J697/1',
  //     retail: null
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Jaguar',
  //     brandID: 362,
  //     url: 'https://jaguarswisswatches.com/watches/j886-1/',
  //     reference: 'J886/1',
  //     retail: null
  //   },
  //   {
  //     source: 'official',
  //     lang: 'en',
  //     brand: 'Jaguar',
  //     brandID: 362,
  //     url: 'https://jaguarswisswatches.com/watches/j887-1/',
  //     reference: 'J887/1',
  //     retail: null
  //   },
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     ...rr[i],
  //     entry: rr[i].url,
  //     base: "https://jaguarswisswatches.com",
  //     client: axios,
  //   });
  //   console.log(ex);
  // }

  for (let i = 0; i < r.items['all'].length; i++) {
    const ex = await extraction({
      ...r.items['all'][i],
      client: axios,
      entry: r.items['all'][i].url,
      base: "https://jaguarswisswatches.com",
    });
    ex.spec.forEach(s => console.log(s.key, ' | ', s.value));
  }
})();