const { MongoClient } = require('mongodb');
const urls = [
    "https://www.jomashop.com/mido-watch-m021-431-11-041-00.html",
    "https://www.jomashop.com/mido-watch-m005-614-36-051-22.html",
    "https://www.jomashop.com/mathey-tissot-watch-h710ai.html",
];

const combine = (p, p1) => {

}

(async () => {
    try {
        const ldb = {
            host: "127.0.0.1",
            port: 27017,
            user: "synopsis",
            pass: "synopsis",
            name: "synopsis",
        }
        const ldb_url = `mongodb://${ldb.user}:${ldb.pass}@${ldb.host}:${ldb.port}/${ldb.name}`;
        const l_conn = await MongoClient.connect(ldb_url, { useUnifiedTopology: true, useNewUrlParser: true, });
        const l_db = l_conn.db(ldb.name);

        for (let i = 0; i < urls.length; i++) {
            const p = await l_db.collection(ldb.name).find({ url: urls[i] }).sort({ lastCheckAt: -1 }).toArray();
            const pr = p && p.length > 0 ? p[0] : null;
            console.log(pr);
            console.log('------------------------------');
            for (let i = 1; i < p.length; i++) {
                combine(pr, p[i]);
                console.log(p[i]);
                console.log('------------------------------');
            }
            console.log('--------------------------------------------------------------------------------');
        }
    } catch (e) {
        console.log(e);
    }
    process.exit(0);
})();