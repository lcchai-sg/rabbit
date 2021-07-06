const fetch = require('cross-fetch');
const cheerio = require('cheerio');

(async () => {
    // const e = "https://www.skagen.com/on/demandware.store/Sites-skagen-jp-Site/ja_JP/Search-UpdateGrid?cgid=shop&start=0&sz=1000";
    // const m = "https://www.skagen.com/on/demandware.store/Sites-skagen-us-Site/en_US/Search-UpdateGrid?cgid=men-watches&start=0&sz=1000";
    // const w = "https://www.skagen.com/on/demandware.store/Sites-skagen-us-Site/en_US/Search-UpdateGrid?cgid=women-watches&start=0&sz=1000";
    const e = "https://www.skagen.com/on/demandware.store/Sites-skagen-us-Site/en_US/Search-UpdateGrid?cgid=shop&start=0&sz=1000";
    const res = await fetch(e);
    const data = await res.text();
    const $ = cheerio.load(data);
    let cnt = 0;
    const notprod = [];
    const uniqprod = []; const notfound = [];
    const cat = new RegExp('watch', 'i');
    $(".quickview").each((idx, el) => {
        console.log('idx : ', idx)
        const d = $(el).attr("data-gtmdata");
        const j = JSON.parse(d);
        if (j.category && j.category.match(cat)) {
            const reference = j.id;
            const amount = j.msrp ? parseFloat(j.msrp) : null;
            const price = j.price;
            const name = j.name;
            console.log({ name, reference, price, amount });
            if (reference && amount && !isNaN(amount)) cnt++;
        } else notprod.push({ name: j.name, category: j.category });
    })
    // {
    //     const res = await fetch(m);
    //     const data = await res.text();
    //     const $ = cheerio.load(data);
    //     $(".quickview").each((idx, el) => {
    //         const d = $(el).attr("data-gtmdata").replace(/"/g, '"');
    //         const j = JSON.parse(d);
    //         if (j.name && j.name.match(/watch/i) && !j.name.match(/strap/i)) {
    //             const reference = j.id;
    //             const amount = j.msrp ? parseFloat(j.msrp) : null;
    //             if (uniqprod.indexOf(reference + " " + amount) < 0) notfound.push("men " + reference + " " + amount);
    //         }
    //     })
    // }
    // {
    //     const res = await fetch(w);
    //     const data = await res.text();
    //     const $ = cheerio.load(data);
    //     $(".quickview").each((idx, el) => {
    //         const d = $(el).attr("data-gtmdata").replace(/"/g, '"');
    //         const j = JSON.parse(d);
    //         if (j.name && j.name.match(/watch/i) && !j.name.match(/strap/i)) {
    //             const reference = j.id;
    //             const amount = j.msrp ? parseFloat(j.msrp) : null;
    //             if (uniqprod.indexOf(reference + " " + amount) < 0) notfound.push("women " + reference + " " + amount);
    //         }
    //     })
    // }
    console.log();
    console.log(`watches : ${cnt}`);
    console.log();
    console.log('not product : ');
    notprod.forEach(p => { console.log(p); });
    console.log();
    // console.log('not found : ');
    // notfound.forEach(p => { console.log(p); });
    console.log('done.');
})();

