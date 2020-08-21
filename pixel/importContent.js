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

    const getIds = async (tab, data) => {
      const result = [];
      for (const d of data) {
        const r = await conn.db(mdb.name).collection(tab).findOne({ name: d });
        if (r) result.push(r.id);
        else console.log('not found in ', tab, ' >>> ', d);
      }
      return result;
    }

    const cnt = await conn.db(mdb.name).collection('source_content')
      .find({ downloaded: 1, converted: { $exists: false } }).count();
    const max = Math.ceil(cnt / 1000);
    let cid = 7001;

    for (let l = 0; l < max; l++) {
      const src = await conn.db(mdb.name).collection('source_content')
        .find({ downloaded: 1, converted: { $exists: false } })
        .skip(l * 1000).limit(1000).toArray();

      for (let i = 0; i < src.length; i++) {
        const { source, category, tags, title, description, altDescription, width, height, color, author, license, rated, format, assetRaw, tokenRaw, tokenThumb, url } = src[i];
        let pid, tgs;
        if (category) {
          pid = await getIds('category', [category]);
          pid = pid ? pid[0] : null;
        }
        if (tags) tgs = await getIds('tag', tags);

        const result = await conn.db(mdb.name).collection('content').findOneAndUpdate(
          { source: { source: url } },
          {
            $currentDate: { updatedAt: true },
            $setOnInsert: {
              id: cid,
              type: "wallpaper",
              title,
              description,
              altDescription,
              width,
              height,
              color,
              primary: pid,     // type not match
              categories: [],   // type not match
              tags: tgs,        // type not match
              source: {
                source: url,
                id: source
              },
              author,
              license,
              rated,
              original: assetRaw,
              format,
              fileToken: tokenRaw,
              thumbnail: tokenThumb,
              provision: 0,
              createdAt: new Date(),
              status: 0,
              revision: 0,
              pendingRevisions: [],
              rejectedRevisions: [],
              revisions: []
            }
          },
          { upsert: true, returnOriginal: false }
        );
        console.log(result.value.id, result.value.description);
        cid++;

        await conn.db(mdb.name).collection('source_content').findOneAndUpdate(
          { id: src[i].id },
          { $set: { converted: 1 } },
          { upsert: true }
        );
      }
    }
    process.exit(0)
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
})();