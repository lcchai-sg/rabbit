const { MongoClient, } = require('mongodb');
const u = require('./u_joma');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompt = require('prompt-sync')();

(async() => {
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

  let stop = ''; let cnt = 0;
  for (let i=0; i<u.length && stop !== 'y'; i++) {
    console.log(u.length,i,u[i]);
    cnt++;
    try {
      const p = await db.collection(mdb.coll).find({url: u[i], assets:{$exists:true}}).toArray();
      if (p.length > 0) {
        console.log('      https://synopsis.cosmos.ieplsg.com/files/' + p[0].assets);
        const cmdurl = 'open -a "Google Chrome" "' + u[i] + '"';
        const asset = 'https://synopsis.cosmos.ieplsg.com/files/'+p[0].assets;
        const cmda = 'open -a "Google Chrome" "' + asset + '"';
        await exec(cmdurl);
        await exec(cmda);
        // const ans = prompt('update db ? ');
        // if (ans === 'y') {
        //   const aaa = await db.collection(mdb.coll).find({url: u[i]}).toArray();
        //   const aa = aaa.map(r=>r.assets);
        //   console.log('url : ', u[i], '     assets : ', p[0].assets, '      distinct : ', aa);
        //   if (aa.length > 0) {
        //     console.log('main : ', p[0].assets, '      to remove : ', aa)
        //     const r  = await db.collection(mdb.coll).updateMany({url: u[i]},{$set:{thumbnail:p[0].thumbnail,assets:p[0].assets}});
        //     if (r) console.log(`update db result, matched: ${r.matchedCount}, updated: ${r.modifiedCount}`);
        //   }
        // }
      } else {
        console.log(' > RE-SCRAPE...');
      }
    } catch (error) {
      console.error(error);
    }
    if (cnt % 30 === 0) {
      stop = prompt('stop processing ? ');
    }
  }
  console.log();
  console.log('done.');
  process.exit(0);
})();
