const { MongoClient } = require('mongodb');

(async () => {
  try {
    const mdb = {
      host: '127.0.0.1',
      port: 27017,
      name: 'pixel',
      user: 'pixel',
      pass: 'pixel',
    };
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, { useUnifiedTopology: true, });

    let cid = 216356;
    const tags = await conn.db('pixel').collection('source_tag').find().skip(cid).toArray();

    for (let i = 0; i < tags.length; i++) {
      const { name, type, title } = tags[i];
      const result = await conn.db(mdb.name).collection('tag').findOneAndUpdate(
        { name },
        {
          $currentDate: { updatedAt: true },
          $setOnInsert: {
            id: cid + i,
            name,
            type,
            title,
            provision: 0,
            status: 0,
            createdAt: new Date()
          },
        },
        { upsert: true, returnOriginal: false }
      );
      console.log(result.value._id, result.value.id, result.value.name);
    }
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
})();