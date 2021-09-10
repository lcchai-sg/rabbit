const { MongoClient } = require('mongodb');

const prodb = [
    "brand",
    "brand_local",
    "channel_product",
    "channel_product_detail",
    "channel_product_local",
    "crowd_data",
    "family",
    "model",
    "model_local",
    "model_local_chrono",
    "product",
    "product_attachment",
    "product_attribute_kind",
    "product_attributes",
    "product_attributes_alias",
    "product_local",
    "product_reference_mapping",
    "reference_collections",
    "reference_product",
    "reference_raw",
    "reference_urls",
    "sequences",
    "translations",
];

(async () => {
    try {
        const ddb = {
            host: "203.118.42.106",
            port: 27017,
            user: "synopsis",
            pass: "synopsis",
            name: "synopsis",
        };

        const ldb = {
            host: "127.0.0.1",
            port: 27017,
            user: "synopsis",
            pass: "synopsis",
            name: "synopsis",
        }

        const exist = (col, item) => {
            let result = false;
            col.forEach(c => {
                if (c.name == item.name && c.type == item.type) result = true;
            })
            return result;
        }

        const ddb_url = `mongodb://${ddb.user}:${ddb.pass}@${ddb.host}:${ddb.port}/${ddb.name}`;
        const d_conn = await MongoClient.connect(ddb_url, { useUnifiedTopology: true, useNewUrlParser: true, });
        const d_db = d_conn.db(ddb.name);
        const ldb_url = `mongodb://${ldb.user}:${ldb.pass}@${ldb.host}:${ldb.port}/${ldb.name}`;
        const l_conn = await MongoClient.connect(ldb_url, { useUnifiedTopology: true, useNewUrlParser: true, });
        const l_db = l_conn.db(ldb.name);
        const d_col = await d_db.listCollections().toArray();
        const l_col = await l_db.listCollections().toArray();
        for (let i = 0; i < d_col.length; i++) {
            const c = d_col[i];
            console.log(i, c.name);
            if (exist(l_col, c)) {
                console.log(c.name, ' clear data.....');
                const r = await l_db.collection(c.name).deleteMany({});
                console.log(r);
            }
            let x = 0; cnt = 0; lim = 10000;
            do {
                const p = await d_db.collection(c.name).find().skip(x * lim).limit(lim).toArray();
                cnt = p ? p.length : 0;
                if (p && p.length > 0) {
                    console.log(x, p.length);
                    x++;
                    const r = await l_db.collection(c.name).insertMany(p);
                    console.log(`inserted : ${r.insertedCount}`);
                }
            } while (cnt >= lim)
        }
    } catch (e) {
        console.log(e)
    }
    console.log();
    console.log('done.....');
    process.exit(0);
})()
