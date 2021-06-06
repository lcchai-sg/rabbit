const fs = require('fs').promises;

(async () => {
    const d = await fs.readFile('nmc_bezel.csv');
    const u = d.toString().split('\n');
    for (let i = 0; i < u.length; i++) {
        const v = u[i].split('|');
        if (v.length === 3) {
            // console.log(`alias : ${v[0]}`);
            // console.log(`value : ${v[1]}`);
            // console.log(`attribute : ${v[2]}`);
        } else console.log(`error : ${u[i]}`);
    }
    console.log();
    console.log('done.');
    process.exit(0);
})()