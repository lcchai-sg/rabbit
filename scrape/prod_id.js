const { MongoClient } = require('mongodb');

(async () => {
  const db_url = `mongodb://localhost/`;
  const conn = await MongoClient.connect(db_url);

  console.log("***** processing data *****");
  try {
    let result = await conn
      .db('synopsis')
      .collection('reference_product')
      .find();
      // .limit(10);
    await result.forEach(async data => {
      let prod = await conn
        .db('synopsis')
        .collection('product')
        .findOne({reference: data.reference, brandID: data.brandID});
      if (prod) {
        console.log("processing :::", data.reference, data.brandID, prod.id);
        let upd = await conn
          .db('synopsis')
          .collection('reference_product')
          .findOneAndUpdate({_id: data._id}, {$set: {productID: prod.id}}, {$upsert: true});
        // console.log(upd);
      }
    }) // result forEach
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
})();
