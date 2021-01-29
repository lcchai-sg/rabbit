const axios = require('axios');
const cheerio = require('cheerio');
const fetchUrl = require('fetch').fetchUrl;

const indexing = async (context) => {
  const { client, entry, base, } = context;
  console.debug('Glashuette Original indexing ...', entry);
  const source = "official";
  const lang = "en";
  const brand = "Glashuette Original";
  const brandID = 168;
  const cfg = { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' } };
  const baseURL = base ? base : "https://www.glashuette-original.com";
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  try {
    const { data } = await client.get(entry, cfg);
    const $ = cheerio.load(data);
    $(".fc-section.fc-block.text-and-image").find(".item-content").each((idx, el) => {
      const url = $(el).find("a").attr("href");
      const name = $(el).find("p").last().text().replace("Discover the ", "").replace("Collection", "").trim();
      if (!name.match(/new products/i)) {
        cats.push({ name, url });
        result.collections.push(name);
        result.items[name] = [];
      }
    })
    for (const cat of cats) {
      console.debug(cat.url);
      const { data } = await client.get(cat.url, cfg);
      const $ = cheerio.load(data);
      $(".fc-section.fc-block.content-wrapper").each((idx, el) => {
        // const name = $(el).find(".page-title").text().replace(/\s+/g, ' ').trim();
        $(el).find("a").each((idx, el) => {
          const url = $(el).attr("href");
          const name = $(el).attr("title");
          const ref = name.split(" ");
          const reference = ref[ref.length - 1];
          const thumbnail = $(el).find("img").attr("src");
          result.items[cat.name].push({
            source, lang, brand, brandID, url, collection: cat.name,
            name, reference, retail: null, thumbnail,
          })
        })
      })
    }
    console.debug('Glashuette Original indexing done.');
    return result;
  } catch (error) {
    console.error('Failed indexing for Glashuette Original with error : ' + error);
    return {};
  }
};

const oindexing = async (context) => {
  const { client, entry, base, } = context;
  console.log(entry);
  const result = { collections: [], items: {} };
  const collections = [];
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);

    $('.four-collections a.four-collections__link')
      .each((idx, element) => {
        collections.push(base + $(element).attr('href'));
      });
    const urls = [];
    for (const url of collections) {
      console.log(url);
      const { data } = await client.get(url);
      const $ = cheerio.load(data);
      let collection = $('main h1').text();
      collection = collection.substr(0, collection.indexOf(" "));
      if (result.collections.indexOf(collection)) {
        result.collections.push(collection);
        result.items[collection] = [];
      }
      $('section.product-list .product-list__item').each((idx, el) => {
        const $$ = cheerio.load(el);
        const href = $$('a').attr('href');
        const reference = $$('.product-list__ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        const n = $$('a h3').text();

        if (urls.indexOf(href) === -1) {
          urls.push(href);
          let url;
          let name = n.startsWith(collection) ? n.substr(collection.length + 1).trim() : n;
          if (href.indexOf('?') > -1) {
            url = href.substring(0, href.indexOf('?'));
          } else {
            url = href;
          }
          if (!url.startsWith('http') && base) {
            url = base + url.substr(1);
          }
          result.items[collection].push({
            url,
            reference,
            collection,
            name
          })
        }
      })
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Glashutte Original with error : ' + error);
    return {};
  }
};

const findSpec = ($, result, el, cl) => {
  $(el).find('.card-body').each((idx, el) => {
    $(el).find(cl).each((idx, el) => {
      const key = $(el).find("h5").text().replace(/\s+/g, " ").trim();
      let ind = false;
      $(el).find("li").each((idx, el) => {
        ind = true;
        const value = $(el).text().replace(/\s+/g, " ").trim();
        if (value) result.spec.push({ key, value });
      })
      if (!ind) {
        $(el).find("div").each((idx, el) => {
          ind = true;
          const value = $(el).text().replace(/\s+/g, " ").trim();
          if (value) result.spec.push({ key, value });
        })
      }
    })
  })
}

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  console.log('entry >>> ', entry)
  const result = { ...rest, url: entry, spec: [], };
  try {
    const $ = cheerio.load((await client.get(entry)).data);

    $(".breadcrumb__list-item").each((idx, el) => {
      if (idx === 2) result.collection = $(el).text().trim();
    });
    result.name = $('.page-title').text().replace(/\s+/g, " ").trim();
    result.reference = $('.info-text').text().trim();
    result.thumbnail = $('.wp-post-image').attr('src');
    $('.watch__keyfact').each((idx, el) => {
      const key = $(el).find(".watch__keyfact-desc.desc").text().replace(/\s+/g, " ").trim();
      const value = $(el).find(".watch__keyfact-value").text().replace(/\s+/g, " ").trim();
      if (value) result.spec.push({ key, value });
    })
    $('.card--go').each((idx, el) => {
      findSpec($, result, el, ".col-12.mb-2");
      findSpec($, result, el, ".pl-3.mb-3");
    })
    return result;
  } catch (error) {
    console.log('Failed extraction for Glashutte Original with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};


(async () => {
  const client = axios.create({
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  });

  // const r = await indexing({
  //   client,
  //   // entry: "https://www.glashuette-original.com/",
  //   entry: "https://www.glashuette-original.com/collection",
  //   brandID: 168,
  //   brand: "Glashutte Original",
  //   base: "https://www.glashuette-original.com/",
  // });
  // console.log(r);
  // let cnt = 0;
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //     cnt++;
  //   })
  // })
  // console.log('number : ', cnt);

  // const rr = r ? r.items[r.collections[0]] : [];
  const rr = [
    "https://www.glashuette-original.com/collection/senator/senator-manual-winding-skeletonized-edition/1-49-18-01-05-30",
    "https://www.glashuette-original.com/watches/vintage/sixties-1-39-52-06-02-04/",
    "https://www.glashuette-original.com/watches/ladies/panomaticluna-1-90-12-06-12-01/",];

  for (let i = 0; i < rr.length; i++) {
    // for (let i = 0; i < rr.length; i++) {
    const ex = await extraction({
      entry: rr[i],
      // entry: rr[i].url,
      client,
      brand: "Glashutte Original",
      brandID: 168,
      base: "https://www.glashuette-original.com/",
    })
    console.log(ex);
  }
})();