const axios = require('axios');
const { Mappers } = require('./utils');

const qryURL = url => {
  const v = url.split('/');
  const vv = v[v.length - 1].replace('.html', '');
  const qry = `productDetail($urlKey:String) {
    productDetail:products(filter:{url_key:{eq:$urlKey}}){
      items{
        name_wout_brand
        is_preowned
        brand_name
        model_id
        image{label url}
        upc_code
        item_variation
        moredetails{
          description
          more_details{
            group_id
            group_label
            group_attributes{
              attribute_id
              attribute_label
              attribute_value
            }
          }
        }
        msrp
        price_range{
          minimum_price{
            regular_price{value currency}
            final_price{value currency}
            msrp_price{value currency}
            discount_on_msrp{amount_off percent_off}
            discount{amount_off percent_off}
          }
        }
      }
    }
  }&operationName=productDetail&variables={"urlKey":"${vv}"}
  `;
  return "https://www.jomashop.com/graphql?query=query " + qry;
};

const extraction = async (context) => {
  try {
    const { client, entry, lang, brand, brandID, productID, thumbnail, source, name, reference, } = context;
    console.debug(entry)
    const result = {
      source, lang, brand, brandID, url: entry, name, reference,
      productID, scripts: [], spec: [], related: [],
    };
    let qry = qryURL(entry);
    const { data } = await client.get(qry);
    if (data.data.productDetail.items.length === 0) {
      // no data found, 404
      result.code = 404;
      return result;
    }
    let d = data.data.productDetail.items[0];
    result.name = d.name_wout_brand;
    const { id: bid, name: brandname } = Mappers.generateBrandID.map(d.brand_name);
    result.brand = brandname;
    result.brandID = bid;
    result.url = entry;
    result.reference = d.model_id;
    result.thumbnail = d.image.url;
    if (d.upc_code) result.upc = d.upc_code;
    result.description = d.moredetails.description;

    let dd = d.moredetails.more_details;
    for (const g of dd) {
      const cat = g.group_label;
      for (const a of g.group_attributes) {
        const key = a.attribute_label;
        const value = a.attribute_value;
        result.spec.push({ cat, key, value });
      }
    }
    result.price = d.msrp;
    result.currency = d.price_range.minimum_price.final_price.currency;
    result.retail = d.price_range.minimum_price.final_price.value;
    return result;
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  const u = [
    "https://www.jomashop.com/preowned-2-rolex-watch-16234-wro.html",
    "https://www.jomashop.com/preowned-2-panerai-watch-pam00120.html",
    "https://www.jomashop.com/preowned-10-panerai-watch-pam01088.html",
    "https://www.jomashop.com/preowned-1-panerai-watch-pam00627.html",
    "https://www.jomashop.com/preowned-1-rolex-watch-116619lb.html",
    "https://www.jomashop.com/preowned-2-rolex-watch-16234-srj.html",
    "https://www.jomashop.com/preowned-1-rolex-watch-16628blso.html",
    "https://www.jomashop.com/blancpain-villeret-watch-6665-3642-55b.html",
    "https://www.jomashop.com/blancpain-watch-6685-1127-55b.html",
    "https://www.jomashop.com/emporio-armani-watch-ar1881.html",
    "https://www.jomashop.com/longines-elegant-watch-l4-310-4-11-6.html",
    "https://www.jomashop.com/longines-presence-watch-l4-805-4-11-2.html",
    "https://www.jomashop.com/swatch-watch-suoj100.html",
    "https://www.jomashop.com/vacheron-constantin-watch-82230-000g-9962.html",
    "https://www.jomashop.com/emporio-armani-watch-ar1798.html",
  ];

  for (let i = 0; i < u.length; i++) {
    let r = await extraction({
      source: "official", lang: "en", client: axios, entry: u[i],
    });
    console.log(r)
    console.log()
    await new Promise(r => setTimeout(r, 1000));
  }
})();