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

    const cats = await conn.db(mdb.name).collection('source_category')
      .find({ converted: { $exists: false } }).toArray();

    for (let i = 0; i < cats.length; i++) {
      const { name, title, subTitle, description, metaTitle, metaDescription, related, level } = cats[i];
      const parent = (level.subcategory) ? [level.category.name] : []
      const result = await conn.db(mdb.name).collection('category').findOneAndUpdate(
        { name },
        {
          $currentDate: { updatedAt: true },
          $setOnInsert: {
            id: i + 1,
            name,
            title,
            subTitle,
            description,
            metaTitle,
            metaDescription,
            relatedCat: related,
            parentCat: parent,
            provision: 0,
            status: 0,
            createdAt: new Date()
          }
        },
        { upsert: true, returnOriginal: false }
      );
      console.log(result.value._id, result.value.id, result.value.name);

      await conn.db(mdb.name).collection('source_category')
        .findOneAndUpdate(
          { name },
          { $set: { converted: 1 } },
          { upsert: true }
        );
    }
    process.exit(0)
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
})();