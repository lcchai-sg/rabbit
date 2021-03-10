const axios = require('axios');
const { Mappers, } = require('./utils');
const { MongoClient } = require('mongodb');

const qryPage = page => {
  const qry = `prod($pageSize:Int!,$currentPage:Int!,$filter:ProductAttributeFilterInput!) {
    products(pageSize:$pageSize,currentPage:$currentPage,filter:$filter) {
      items {
        id name msrp price_range {
          minimum_price {
            regular_price {value currency}
            final_price {value currency}
            msrp_price {value currency}
            discount_on_msrp {amount_off percent_off}
            plp_price {was_price now_price discount}
          }
        }
        brand_name name_wout_brand special_price sku small_image{url} url_key is_preowned
      }
      page_info {total_pages current_page}
      total_count
    }
  }&operationName=prod&variables={"currentPage":${page},"pageSize":60,"filter":{"category_id":{"eq":"871"}}}`;
  return "https://www.jomashop.com/graphql?query=query " + qry;
}

const indexing = async () => {
  console.log('start indexing ...')
  const source = "jomashop";
  const lang = "en";
  const baseURL = "https://www.jomashop.com/";
  const result = [];
  let payload = { source, lang, collections: ['all'], items: { 'all': [] } };
  const q = qryPage(1);
  const { data } = await axios.get(q);
  const pages = data.data.products.page_info.total_pages ? data.data.products.page_info.total_pages : 0;
  let cnt = 0;
  for (let i = 1; i <= pages; i++) {
    console.log(i)
    const q = qryPage(i);
    const { data } = await axios.get(q);
    if (!data.errors) {
      const items = data.data.products.items;
      for (let k = 0; k < items.length; k++) {
        const { id: brandID, name: brand } = Mappers.generateBrandID.map(items[k].brand_name);
        payload.items['all'].push({
          source, lang, brand, brandID,
          url: baseURL + items[k].url_key + '.html',
          pid: items[k].id,
          name: items[k].name,
          retail: items[k].msrp,
          price: items[k].special_price,
          reference: items[k].sku,
          thumbnail: items[k].small_image.url,
        })
        cnt++;
        if (cnt % 500 === 0) {
          result.push(payload);
          payload = { source, lang, collections: ['all'], items: { 'all': [] } };
        }
      }
    }
  }
  if (payload.items['all'].length > 0) result.push(payload);
  console.log('indexing completed...')
  return result;
}

(async () => {
  const r = await indexing();
  console.log(r);

  const mdb = {
    // local
    host: '127.0.0.1',
    port: 27017,
    user: 'synopsis',
    pass: 'synopsis',
    name: 'synopsis',
    coll: 'joma_urls',
  };
  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  for (let i = 0; i < r.items['all'].length; i++) {
    console.log(r.items['all'].length, i)
    await db.collection(mdb.coll).insertOne(r.items['all'][i]);
  }
  console.log()
  console.log('done.')
  process.exit(0)
})()