const { MongoClient } = require('mongodb');
const { Mappers } = require("./utils");

(async () => {
  const c_db_url = `mongodb+srv://root:sysadmin@cluster0-jrvjy.mongodb.net/synopsis?retryWrites=true&w=majority`;
  const c_conn = await MongoClient.connect(c_db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const c_db = c_conn.db("synopsis");

  const r = await c_db.collection('urls_ptime_web').find({ brandID: { $exists: false } }).toArray();
  for (let i = 0; i < r.length; i++) {
    console.log(r.length, i)
    const { id, name } = Mappers.generateBrandID.map(r[i].brand);
    if (id) {
      console.log('updating...', r[i]._id, r[i].brand, id)
      await c_db.collection('urls_ptime_web').findOneAndUpdate(
        { _id: r[i]._id },
        { $set: { brand: name, brandID: id } }
      )
    }
  }
  console.log();
  console.log('*** done ***');
  process.exit(0);
})();