const { MongoClient } = require('mongodb');

(async () => {
    try {
        const ldb = {
            host: "127.0.0.1",
            port: 27017,
            user: "synopsis",
            pass: "synopsis",
            name: "synopsis",
            coll: "p_reference_raw",
        }
        const ldb_url = `mongodb://${ldb.user}:${ldb.pass}@${ldb.host}:${ldb.port}/${ldb.name}`;
        const l_conn = await MongoClient.connect(ldb_url, { useUnifiedTopology: true, useNewUrlParser: true, });
        const l_db = l_conn.db(ldb.name);

        const limit = 100000;
        const uniq = [];
        for (let i = 0; i < 5; i++) {
            const r = await l_db.collection(ldb.coll).find({ source: "jomashop" }).skip(i * limit).limit(limit).toArray();
            if (r.length > 0) {
                for (let j = 0; j < r.length; j++) {
                    if (Array.isArray(r[j].spec)) {
                        for (const s of r[j].spec) {
                            const cat = Object.keys(s)[0];
                            const key = Object.keys(s)[1];
                            // const value = Object.keys(s)[2];
                            let out = '';
                            if (cat) out = s[cat];
                            if (key) out = out + " | " + s[key];
                            // if (value) out = out + " | " + s[value];
                            if (uniq.indexOf(out) < 0) {
                                uniq.push(out);
                                console.log(out);
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
    process.exit(0);
})();
