const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
  const source = "official";
  const lang = "en";
  const brand = "Muehle Glashuette"
  const brandID = 292;
  const { client, base, entry, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {}, };
  const cats = [];
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    $('#footer_sitemap').find(".ebene-2").find('a').each((idx, el) => {
      const url = base + $(el).attr('href');
      if (url.match(/wristwatches/i)) {
        const name = $(el).text();
        if (result.collections.indexOf(name) < 0) {
          result.collections.push(name);
          result.items[name] = [];
          cats.push({ name, url });
        }
      }
    })
    //'https://www.muehle-glashuette.de/en/wristwatches/functional-wristwatches/'
    //'https://www.muehle-glashuette.de/en/wristwatches/r-muehle-manufacturing-line/'
    for (const cat of cats) {
      const { data } = await client.get(cat.url);
      const $ = cheerio.load(data);
      $(".tx-mguhr").find(".col-sm-3.col-md-2").each((idx, el) => {
        const thumbnail = $(el).find("img").attr("src");
        const name = $(el).find("h2").text();
        const url = base + $(el).find("a").attr("href");
        result.items[cat.name].push({
          source, lang, brand, brandID, url, collection: cat.name,
          name, thumbnail, reference: null, price: null,
        })
      })
    }
    return result;
  } catch (error) {
    console.log("Error indexing for Muehle GLashuette with error : ", error);
    console.log("entry : ", entry);
    return {};
  }
}

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const baseURL = base ? base : "https://www.muehle-glashuette.de/";
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.name = $('meta[name="og:title"]').attr('content');
    result.description = $('meta[name="og:description"]').attr('content');
    $(".malihu-scroller").find("li").each((idx, el) => {
      const key = $(el).find('h2').text().trim();
      const value = $(el).find('p').text().trim();
      result.spec.push({ key, value });
    });
    let s = {};
    $("#variants").find(".c").first().each((idx, el) => {
      $(el).find("#detaildesc").find("div").each((idxDiv, el) => {
        const ref = $(el).find("h2").text().replace(/reference/i, '').trim();
        if (ref) {
          // result.spec.push({ key: 'v_reference' + idxDiv, value: ref });
          s[idxDiv] = [];
          s[idxDiv].push({ key: 'v_reference', value: ref });
          $(el).find("p").each((idx, el) => {
            const spec = $(el).text().split(":");
            if (spec.length === 2) {
              const value = spec[1].trim();
              // if (value) result.spec.push({ key: 'v_' + spec[0] + idxDiv, value });
              if (value) s[idxDiv].push({ key: 'v_' + spec[0] + idxDiv, value });
            } else if (spec.length === 1) {
              const value = spec[0].trim();
              if (value) {
                // result.spec.push({ key: 'v_' + idxDiv, value })
                s[idxDiv].push({ key: 'v_' + idxDiv, value });
              }
            } else {
              logger.debug("unknown specifications, ", spec);
            }
          })
        }
      })
      let i = 0;
      $(el).find(".v-img-c").find(".img-c").each((idx, el) => {
        const thumbnail = baseURL + $(el).find("img").attr("src");
        const face = $(el).attr("data-angle");
        if (face === '0') {
          // result.spec.push({ key: "v_thumbnail" + i, value: thumbnail });
          s[i].push({ key: "v_thumbnail" + i, value: thumbnail });
          i++;
        }
      })
    })
    result.spec.push({ key: 'variations', value: s })
  } catch (error) {
    console.error('Failed extraction for Muehle Glasshuette with error : ' + error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: "https://www.muehle-glashuette.de/en/",
  //   base: "https://www.muehle-glashuette.de/",
  // })
  // console.log(r);
  // r.collections.forEach(c => {
  //   console.log('collection.....', c)
  //   r.items[c].forEach(w => console.log(w));
  // })
  // for (let i = 0; i < 1; i++) {
  // for (let i = 0; i < r.collections.length; i++) {
  //   const c = r.collections[i];
  //   // for (let j = 0; j < 1; j++) {
  //   for (let j = 0; j < r.items[c].length; j++) {
  //     // console.log(r.items[c][j]);
  //     const ex = await extraction({
  //       ...r.items[c][j],
  //       client: axios,
  //       entry: r.items[c][j]['url'],
  //       base: "https://www.muehle-glashuette.de/",
  //     });
  //     // console.log(ex);
  //     // console.log()
  //     // console.log()
  //     console.log(ex.url)
  //     ex.spec.forEach(s => {
  //       console.log(s.key + ' | ' + s.value);
  //     });
  //     console.log()
  //     // await new Promise(r => setTimeout(r, 3000));
  //   }
  // }

  const ex = await extraction({
    client: axios,
    base: "https://www.muehle-glashuette.de/",
    entry: "https://www.muehle-glashuette.de/en/wristwatches/functional-wristwatches/promare-datum/",
  })
  // console.log(ex)
  // ex.spec.forEach(s => {
  //   if (s.key === 'variations') {
  //     Object.keys(s.value).forEach(k => {
  //       s.value[k].forEach(v => console.log('   ', v.key, v.value))
  //     })
  //   } else console.log(s.key, s.value);
  // })

  console.log()
  const vars = [];
  for (const s of ex.spec) {
    const key = s.key;
    const value = s.value;
    if (key === 'variations') {
      let r = {};
      Object.keys(value).forEach(key => {
        for (const s of value[key]) {
          console.log('    ', s.key, s.value)
          const key1 = s.key;
          const value1 = s.value;
          if (key1.match(/reference/i)) r.reference = value1;
          else if (key1.match(/Face colour/i)) r.dialColor = value1;
          else if (key1.match(/limited edition/i)) r.limited = true;
          else if (key1.match(/thumbnail/i)) r.thumbnail = value1;
          else r.strap = value1;
        }
        vars.push(r);
      })
    }
  }
  console.log('vars....', vars)
})();