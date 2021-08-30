const fs = require('fs');

(async () => {
    const base = `/Users/lcchai/work/projects/appraise-msrp/src/units`;
    const files = fs.readdirSync(base);
    const ws = fs.createWriteStream("usa.sh");
    for (const file of files) {
        const f = file.split(".")[0];
        ws.write(`ts-node src/scraper.ts ${f} hkg\n`);
    }
})()