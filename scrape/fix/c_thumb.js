const { default: axios } = require('axios');
const { MongoClient } = require('mongodb');
const u = require('./fix_u');

(async () => {
    const mdb = {
        host: "192.168.200.227",
        port: 27017,
        user: "productManager",
        pass: "UInJRX7m",
        name: "synopsis",
        coll: "reference_product",
    };
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url,
        { useNewUrlParser: true, useUnifiedTopology: true, });
    const db = conn.db(mdb.name);
    for (let i = 0; i < u.length; i++) {
        try {
            console.log(u[i]);
            const p = await db.collection(mdb.name).find({ url: u[i], assets: { $exists: true } }).toArray();
            if (p.length > 0) {
                for (let j = 0; j < p.length; j++) {
                    const asset = "https://synopsis.cosmos.ieplsg.com/files/" + p[j].assets;
                    try {
                        const { data } = await axios.get(asset);
                    } catch (error) {
                        console.log("seaweed assets with error : ", error);
                        if (error.response && error.response.status === 404) {
                            console.log('not found in seaweed : ', asset);
                        }
                    }
                }
            }
        } catch (error) {
            console.log("get product assets error : ", error);
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();