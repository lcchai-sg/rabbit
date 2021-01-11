const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
  const { client, entry, base } = context;
  const source = "official";
  const lang = "en";
  const brand = "Suunto";
  const brandID = 184;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const urls = [
    "https://www.suunto.com/en-us/Product-search/See-all-Sports-Watches/",
    "https://www.suunto.com/en-us/Product-search/dive-watches/",
  ];
  for (const url of urls) {
    console.log(url);
    try {
      const { data } = await client.get(url);
    } catch (error) {
      console.log("Failed indexing for Suunto with error : ", error);
      return {};
    }
  }
}

const extraction = async context => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], variants: [], };
  try {
    const { data } = await client.get(entry);
    const ids = data.match(/data-contentid="\w+"/ig);
    const id = ids ? ids[0].split("=")[1].replace(/"/g, "") : null;
    if (id) {
      const basic = "https://www.suunto.com/api/productbasicinfo/getitem/" + id + "/en-US";
      const spec = "https://www.suunto.com/api/productspecifications/getitems/" + id + "/en-US";
      //https://www.suunto.com/api/benefits/getitems/283409/en-US
      const keyf = "https://www.suunto.com/api/keyfeatures/getitems/" + id + "/en-US";
      {
        const { data } = await client.get(basic);
        // console.log(data);
        result.reference = data.Ssid;
        result.id = data.ContentId;
        result.name = data.PageName;
        result.thumbnail = base + data.ImageUrl;
        data.ProductVariants.forEach(v => {
          result.variants.push(v.Ssid);
        })
        const j = JSON.parse(data.StructuredData.replace(/\s+/, ''));
        if (j.offers) {
          result.price = j.offers.priceCurrency + ' ' + j.offers.price;
        }
      }
      {
        const { data } = await client.get(spec);
        // console.log(data);
        data.SpecificationsList.forEach(s => {
          s.SpecificationCategory.forEach(sp => {
            sp.Specifications.forEach(v => {
              if (v.Description) result.spec.push({ key: "functions", value: v.Name + ' : ' + v.Description.replace("<p>", "").replace("</p>", "").trim() });
              else result.spec.push({ key: "functions", value: v.Name });
            });
          })
        })
      }
      {
        const { data } = await client.get(keyf);
        // console.log(data);
        data.Items.forEach(i => {
          result.spec.push({ key: "features", value: i.Title });
        })
      }
    }
  } catch (error) {
    console.error("Failed extraction for Suunto with error : ", error);
    console.error("entry : ", entry);
    if (error.response) result.code = error.response.status;
    else result.code = "UNKNOWN ERROR";
  }
  return result;
}

(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: "https://www.suunto.com/en-us/Product-search/See-all-Sports-Watches/",
  //   base: "",
  // })
  // console.log(r);

  const r = [
    "https://www.suunto.com/en-us/Products/Sports-Watches/suunto-7/suunto-7-black-lime/",
    "https://www.suunto.com/en-us/Products/Sports-Watches/suunto-3/suunto-3-all-black/",
    "https://www.suunto.com/en-us/Products/Sports-Watches/suunto-5/suunto-5-all-black/",
  ]
  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r[i],
      base: "https://www.suunto.com",
    });
    console.log(ex);
  }
})();