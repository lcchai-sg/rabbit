const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Garmin";
  const brandID = 352;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
  const urls = [
    "https://buy.garmin.com/categoryServices/en-US/US/categories/10002/products?currentPage=1&itemsPerPage=50",
    "https://buy.garmin.com/categoryServices/en-US/US/categories/10660/products?currentPage=1&itemsPerPage=50",
    "https://buy.garmin.com/categoryServices/en-US/US/categories/10662/products?currentPage=1&itemsPerPage=50",
    "https://buy.garmin.com/categoryServices/en-US/US/categories/10664/products?currentPage=1&itemsPerPage=50",
    "https://buy.garmin.com/categoryServices/en-US/US/categories/10668/products?currentPage=1&itemsPerPage=50",
    "https://buy.garmin.com/categoryServices/en-US/US/categories/10921/products?currentPage=1&itemsPerPage=50",
    "https://buy.garmin.com/categoryServices/en-US/US/categories/11040/products?currentPage=1&itemsPerPage=50",
  ];
  const uniq = [];
  try {
    for (const url of urls) {
      const { data } = await client.get(url);
      const p = data.products;
      for (let i = 1; i < p.length; i++) {
        const reference = p[i].id;
        const name = p[i].name;
        const url = p[i].url;
        const thumbnail = p[i].image?.imageUrl?.highResolution ? p[i].image?.imageUrl?.highResolution :
          p[i].image?.imageUrl?.large ? p[i].image?.imageUrl?.large : null;
        const retail = p[i].price?.listPrice?.formattedAmount;
        if (uniq.indexOf(url) < 0) {
          result.items['all'].push({
            source, lang, brand, brandID, url, name, reference,
            thumbnail, retail,
          })
          uniq.push(url);
        }
      }
    }
    return result;
  } catch (error) {
    console.error("Failed indexing for Garmin with error : ", error);
    return {};
  }
}

const extraction = async context => {
  const { client, entry, base, ...rest } = context;
  const baseURL = base ? base : "https://buy.garmin.com";
  const result = { ...rest, url: entry, spec: [], variations: [], }
  rest.source = "official";
  rest.lang = "en";
  rest.brand = "Garmin";
  rest.brandID = 352;
  const results = [];
  console.log('entry >>> ', entry);
  if (entry.match(/\/pn\//i)) {
    return await extractUrl(context);
  } else {
    // get all variations
    try {
      const { data } = await client.get(entry);
      const $ = cheerio.load(data);
      const variations = [];
      $(".app__product__filters__group").each((idx, el) => {
        const v = $(el).find(".g__tooltip__summary").text();
        if (!v) {
          // color/model, this should contain all variations
          // const v = $(el).find(".app__product__filters__label").text().replace(/\s+/g, "").trim();
          $(el).find(".app__product__filters__option").each((idx, el) => {
            const url = baseURL + $(el).find("a").attr("href");
            variations.push(url)
          })
        }
      })
      for (let i = 0; i < variations.length; i++) {
        const r = await extractUrl({ ...context, entry: variations[i], });
        results.push(r);
      }
    } catch (error) {
      console.error('Failed extraction for Garmin with error : ', error);
      console.error('entry : ', entry);
      if (error.response) result.code = error.response.status;
      else result.code = 'UNKNOWN ERROR';
    }
    results.push(result);
    return results;
  }
}

const extractUrl = async context => {
  const { client, entry, base, ...rest } = context;
  console.log('          >>> ', entry);
  const baseURL = base ? base : "https://buy.garmin.com";
  const result = { ...rest, url: entry, spec: [], variations: [], }
  result.source = "official";
  result.lang = "en";
  result.brand = "Garmin";
  result.brandID = 352;
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.name = $('meta[property="og:title"]').attr('content');
    result.description = $('meta[property="og:description"]').attr('content');
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    result.retail = $('meta[name="price_currency"]').attr('content') + ' ' + $('meta[name="product_price"]').attr('content');
    result.reference = $("#js__product__info__sku").text();
    // result.name = $('meta[name="product_name"]').attr('content');
    // result.description = $('meta[name="description"]').attr('content');
    // result.thumbnail = $('meta[name="product_image"]').attr('content');
    // result.name = $(".app__product__info__name").text() + "   " + $(".app__product__info__variation").text();
    $(".app__product__filters__group").each((idx, el) => {
      const v = $(el).find(".g__tooltip__summary").text();
      if (!v) {
        // color/model, this should contain all variations
        // const v = $(el).find(".app__product__filters__label").text().replace(/\s+/g, "").trim();
        $(el).find(".app__product__filters__option").each((idx, el) => {
          const url = baseURL + $(el).find("a").attr("href");
          const reference = $(el).find("a").attr("data-sku");
          result.variations.push({ reference, url, })
        })
      }
    })
    $(".app__tabs__content__sec").each((idx, el) => {
      const id = $(el).attr("id");
      if (id === "overview") {
        $(el).find("pc-feature-card").each((idx, el) => {
          const key = $(el).attr("title");
          const value = $(el).attr("description").replace(/<\/?[^>]+(>|$)/g, "").trim();
          if (key && value) result.spec.push({ key, value });
          else if (value) result.spec.push({ key: "overview", value });
        })
      } else if (id === "specs") {
        $(el).find("tr").each((idx, el) => {
          const key = $(el).find("th").text();
          const v = $(el).find("td").text().replace(/<\/?[^>]+(>|$)/g, "").trim();
          const value = v ? v.replace(/\n/g, "   ") : $(el).find("td").attr("class");
          if (key && value) result.spec.push({ key, value });
        })
      }
    })
  } catch (error) {
    console.error('Failed extraction for Garmin with error : ', error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
}

(async () => {
  // const r = await indexing({
  //   entry: "https://buy.garmin.com/en-US/US/c10002-p0.html",
  //   client: axios,
  //   base: "",
  // })
  // r.items['all'].forEach(w => {
  //   console.log(w)
  // })
  // console.log(r.items['all'].length)

  const r = [
    {
      source: 'official',
      lang: 'en',
      brand: 'Garmin',
      brandID: 352,
      url: 'https://buy.garmin.com/en-US/US/p/702902',
      name: 'fēnix® 6 Series',
      reference: '16600',
      description: '<p>Youwanttheultimateinoutdoorperformance.Thefaceofadventure.Themultisportmessiah.ThisGPSsmartwatchseriesisatthepinnacleofexplorationandathleticism.</p>',
      thumbnail: 'https://static.garmincdn.com/en/products/010-02410-14/v/cf-lg-8beb21e8-4285-4569-ab2b-0b6dfbb47e84.jpg',
      retail: '$549.99 USD'
    },
    // {
    //   source: 'official',
    //   lang: 'en',
    //   brand: 'Garmin',
    //   brandID: 352,
    //   url: 'https://buy.garmin.com/en-US/US/p/702902',
    //   name: 'fēnix® 6 - Pro Solar Edition',
    //   reference: '702902',
    //   description: '<p>Harnessthepowerofthesunwiththefēnix®6ProSolarpremiummultisportGPSwatch.FeaturingaPowerGlass™solarcharginglensandcustomizablepowermanagermodes,thissmartwatchcanstayonandremainperformance-readyforweeks.</p>',
    //   thumbnail: 'https://static.garmincdn.com/en/products/010-02410-14/v/cf-lg-8beb21e8-4285-4569-ab2b-0b6dfbb47e84.jpg',
    //   retail: '$799.99 USD'
    // },
    // {
    //   source: 'official',
    //   lang: 'en',
    //   brand: 'Garmin',
    //   brandID: 352,
    //   url: 'https://buy.garmin.com/en-US/US/p/641479',
    //   name: 'fēnix® 6 - Pro and Sapphire Editions',
    //   reference: '641479',
    //   description: 'YouwanttheultimateinoutdoorperformancefromyourGPSsmartwatch.Atthepinnacleofexplorationandathleticism,thisoneaddsmusicandmapping.',
    //   thumbnail: 'https://static.garmincdn.com/en/products/010-02158-13/v/cf-lg-a836df96-628f-4aa8-8bc0-3d6ecaf0e1f4.jpg',
    //   retail: '$649.99 USD'
    // }
  ];
  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      ...r[i],
      client: axios,
      entry: r[i].url,
      base: "https://buy.garmin.com",
    });
    for (let i = 0; i < ex.length; i++) {
      console.log();
      console.log();
      console.log(ex[i]);
      console.log();
      ex[i].spec.forEach(s => console.log('    ' + s.key + ' | ' + s.value));
      console.log()
    }
  };
  // for (let i = 0; i < r.items['all'].length; i++) {
  //   const ex = await extraction({
  //     ...r.items['all'][i],
  //     client: axios,
  //     entry: r.items['all'][i].url,
  //     base: "https://buy.garmin.com",
  //   });
  //   console.log()
  //   console.log()
  //   for (let i = 0; i < ex.length; i++) {
  //     console.log(ex[i].url);
  //     ex[i].spec.forEach(s => console.log('    ' + s.key + ' | ' + s.value));
  //     console.log()
  //   }
  //   console.log()
  // }
})();