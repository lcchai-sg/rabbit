const axios = require('axios');
const fs = require('fs').promises;
const fp = "https://synopsis.cosmos.ieplsg.com/files/";
const p1 = "4,089dd8447a1990";
const p2 = "6,053df23333039f";

(async () => {
    const a1 = fp + p1;
    const { headers: h1 } = await axios.get(a1);
    console.log(`${p1}     length : ${h1['content-length']}      etag : ${h1['etag']}`);
    const a2 = fp + p2;
    const { headers: h2 } = await axios.get(a2);
    console.log(`${p2}     length : ${h2['content-length']}      etag : ${h2['etag']}`);
    console.log();

    const data = await fs.readFile("u_assets.txt");
    const u = data.toString().split('\n');

    let cnt = 0;
    for (let i = 0; i < u.length; i++) {
        const assets = u[i].split(' ||| ')[1];
        try {
            const a = fp + assets;
            const { headers: h } = await axios.get(a);
            console.log(i, ' >>> ', a, ' >>> ', h['content-length'], ' >>> ', h['etag']);
            if ((h['content-length'] === h1['content-length'] && h['etag'] === h1['etag']) ||
                (h['content-length'] === h2['content-length'] && h['etag'] === h2['etag'])) {
                const out = "'" + assets + "',";
                console.log(assets);
                fs.appendFile('placeholder.txt', out, (err) => { if (err) throw err; })
                cnt++;
                if (cnt % 3 === 0) {
                    fs.appendFile('placeholder.txt', '\n', (err) => { if (err) throw err; })
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log();
    console.log('done.');
    process.exit(0);
})();