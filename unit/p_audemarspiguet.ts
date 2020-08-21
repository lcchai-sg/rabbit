const axios = require('axios');
const { MongoClient } = require('mongodb');

(async () => {
  const base = "https://www.audemarspiguet.com";
  const jsonData = 'https://www.audemarspiguet.com/api/v1/watches/?lang=en';
  let json;

  const db_url = `mongodb+srv://root:sysadmin@cluster0-jrvjy.mongodb.net/synopsis?retryWrites=true&w=majority`;
  const conn = await MongoClient.connect(db_url, { useUnifiedTopology: true });
  const db = conn.db("synopsis");
  const coll = db.collection("reference_pricing");

  try {
    json = (await axios.get(jsonData))['data'];
  } catch (error) {
    console.log("*** error ***");
    console.log(jsonData);
    console.log(error);
    process.exit(1);
  }

  const currency = ['USD', 'JPY', 'CNY', 'HKD'];
  const source = 'official';
  const lang = 'en';
  const brand = 'Audemars Piguet';
  const brandID = 18;

  for (const i in json['data']) {
    let reference = json['data'][i]['reference'];

    let retail = [];
    let state = [];
    const jsonPData = 'https://www.audemarspiguet.com/api/v1/watchprice/?lang=en&reference=' + reference;
    let jsonP
    try {
      jsonP = (await axios.get(jsonPData)).data.data;
      jsonP.some(data => {
        if (data.price && data.price.currency && currency.indexOf(data.price.currency)>= 0) {
          if (state.indexOf(data.price.currency) < 0) {
            state.push(data.price.currency);
            retail.push({currency: data.price.currency, price: data.price.amount});
          }
          return (state.length === currency.length);
        }
      }) //forEach
    } catch (error) {
      if (!(error.response.status === 403)) {
        console.log("*** error ***");
        console.log(jsonPData);
        console.log(error);
        process.exit(1);
      }
    }
    
    let url = base + json['data'][i]['permalink'];
    let collection = json['data'][i]['permalink'].split('/watch-collection/')[1].split('/')[0];
    let name = json['data'][i]['alt'];
    let thumbnail = base + json['data'][i]['assets']['standup_flattened'];

    await coll.findOneAndUpdate(
      { reference, lang, url, brandID },
      { $set: { productID: null, name, brand, source, collection, retail, thumbnail } },
      { upsert: true }
    );
  } //for

  process.exit(0);
})();



