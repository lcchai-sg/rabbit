const { MongoClient } = require('mongodb');
const d = [
    "attributes",
    "brand",
    "brand_local",
    "channel_product",
    "channel_product_detail",
    "channel_product_local",
    "crowd_data",
    "design",
    "family",
    "model",
    "model_local",
    "model_local_chrono",
    "product",
    "product_attachment",
    "product_attribute_kind",
    "product_attributes",
    "product_attributes_alias",
    "product_jewellery",
    "product_local",
    "product_reference",
    "product_reference_mapping",
    "reference_collections",
    "reference_price",
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
        }
        const ldb = {
            host: "127.0.0.1",
            port: 27017,
            user: "synopsis",
            pass: "synopsis",
            name: "synopsis",
        }
        const ddb_url = `mongodb://${ddb.user}:${ddb.pass}@${ddb.host}:${ddb.port}/${ddb.name}`;
        const d_conn = await MongoClient.connect(ddb_url, { useUnifiedTopology: true, useNewUrlParser: true, });
        const d_db = d_conn.db(ddb.name);
        const ldb_url = `mongodb://${ldb.user}:${ldb.pass}@${ldb.host}:${ldb.port}/${ldb.name}`;
        const l_conn = await MongoClient.connect(ldb_url, { useUnifiedTopology: true, useNewUrlParser: true, });
        const l_db = l_conn.db(ldb.name);

        for (let i = 0; i < d.length; i++) {
            let k = 0, cnt = 0; const lim = 10000;
            do {
                const r = await d_db.collection(d[i]).find().skip(k * lim).limit(lim).toArray();
                if (r && r.length > 0) {
                    cnt = r.length;
                    const rr = await l_db.collection(d[i]).insertMany(r);
                    console.log(d[i], rr.result);
                }
                k++;
            } while (cnt >= lim)
        }
    } catch (e) {
        console.log(e);
    }
    process.exit(0);
})();
