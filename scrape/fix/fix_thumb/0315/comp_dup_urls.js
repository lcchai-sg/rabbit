const { MongoClient } = require('mongodb');
const u = require('./dup_urls_joma');

(async () => {
  const mdb = {
    host: '127.0.0.1',
    port: 27017,
    user: 'synopsis',
    pass: 'synopsis',
    name: 'synopsis',
    coll: 'p_reference_product',
  };

  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  const compobj = (source, item) => {
    const diff = [];
    // console.log('compobj : ', source, item)
    if (source)
      Object.keys(source).forEach(k => {
        if (Array.isArray(source[k])) {
          // handle array
          // if (Array.isArray(item[k])) {
          //   item[k].forEach(v => {
          //     if (source[k].indexOf(v) < 0)
          //       source[k].push(v);
          //   })
          // } else {
          //   if (source[k].indexOf(item[k]) < 0)
          //     source[k].push(item[k]);
          // }
          console.log(`compare array`)
        } else if (typeof source[k] === 'object') {
          // handle object
          console.log(`compare object`);
          if (typeof item[k] === 'object') {
            const d = compobj(source[k], item[k]);
            d.forEach(v => diff.push(v));
          } else {
            diff.push(k + "   " + source[k] + "   " + item[k]);
          }
        } if (item[k] && item[k] !== source[k]) {
          diff.push(k + "   " + source[k] + "   " + item[k])
        }
      });
    if (item)
      Object.keys(item).forEach(k => {
        if (!source[k]) {
          diff.push(k + "   " + "UNDEFINED" + "   " + item[k])
        }
      })
    return diff;
  }
  for (let i = 0; i < 1; i++) {
    // for (let i = 0; i < u.length; i++) {
    console.log(u.length, i, u[i]);
    const p = await db.collection(mdb.coll).find({ url: u[i] }).sort({ lastCheckAt: -1 }).toArray();
    for (let j = 1; j < p.length; j++) {
      console.log(p[0]._id, '     ', p[j]._id)
      const diff = compobj(p[0], p[j]);
      console.log('   ', j, diff);
      console.log();
    }
  }
  console.log();
  console.log('done.')
  process.exit(0);
})();