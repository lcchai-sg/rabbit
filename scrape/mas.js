const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
    const { client, entry, base, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Maserati";
    result.brandID = 346;
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        result.name = $("meta[property='og:title']").attr("content").split('-')[0].trim();
        // result.description = $("meta[property='og:description']").attr("content");
        result.description = $(".description-wrapper").contents().toString().replace('<h2>Description</h2>', '').replace(/\s+/g, ' ').trim();
        result.thumbnail = $("meta[property='og:image']").attr("content");
        const retail = $(".old-price").find(".price").text().replace(/\s+/g, '');
        const price = $(".special-price").find(".price").text().replace(/\s+/g, '');
        const rprice = $(".regular-price").find(".price").text().replace(/\s+/g, '');
        result.price = price ? price : rprice;
        result.retail = retail ? retail : rprice;
        result.reference = $(".product-sku").text();
        let values = [];
        if (result.description.match(/<br>/i)) values = result.description.split('<br>');
        else if (result.description.match(/-/)) values = result.description.split('-');
        else if (result.description.match(/\./i)) values = result.description.split('.');
        values.forEach(value => {
            const v = value.trim();
            if (v) result.spec.push(v);
        })
    } catch (error) {
        console.error('Failed extraction for Maserati with error : ' + error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};
(async () => {
    const u = [
        "https://www.maseratistore.com/us_en/watches/traguardo-16275.html",
        "https://www.maseratistore.com/us_en/watches/watch-epoca-lady-r8851118501.html",
        "https://www.maseratistore.com/us_en/watches/watch-epoca-lady-r8853118502.html",
        "https://www.maseratistore.com/us_en/watches/watch-epoca-lady-r8853118504.html",
        "https://www.maseratistore.com/us_en/watches/potenza-lady-35mm.html",
        "https://www.maseratistore.com/us_en/watches/watch-traguardo-r8871612025.html",
        "https://www.maseratistore.com/us_en/watches/gentleman-3h-43mm.html",
        "https://www.maseratistore.com/us_en/watches/successo-chronograph-44mm.html",
        "https://www.maseratistore.com/us_en/watches/watch-trimarano-r8851132002.html",
        "https://www.maseratistore.com/us_en/watches/watch-granturismo-r8873134003.html",
        "https://www.maseratistore.com/us_en/watches/campione-kids-black-28mm.html",
        "https://www.maseratistore.com/us_en/watches/campione-kids.html",
        "https://www.maseratistore.com/us_en/watches/campione-kids-red-28mm.html",
        "https://www.maseratistore.com/us_en/watches/campione-kids-sky-blue-28mm.html",
        "https://www.maseratistore.com/us_en/watches/campione-kids-white-28mm.html",
        "https://www.maseratistore.com/us_en/watches/traguardo-chronograph-45mm-50119.html",
        "https://www.maseratistore.com/us_en/watches/royale-limited-edition.html",
        "https://www.maseratistore.com/us_en/legend-watch-r8851138003.html",
        "https://www.maseratistore.com/us_en/watches/legend-watch-r8851138003.html",
        "https://www.maseratistore.com/us_en/watches/orologio-legend-r8871638001.html",
        "https://www.maseratistore.com/us_en/watches/legend-chronograph-42mm-50281.html",
        "https://www.maseratistore.com/us_en/watches/triconic-watch-r8823139003.html",
        "https://www.maseratistore.com/us_en/watches/orologio-triconic-r8871639004.html",
        "https://www.maseratistore.com/us_en/watches/sfida-watch-r8853140001.html",
        "https://www.maseratistore.com/us_en/watches/sfida-watch-r8853140002.html",
        "https://www.maseratistore.com/us_en/watches/successo-watch-black-pvd-r8871621010.html",
        "https://www.maseratistore.com/us_en/watches/successo-watch-black-pvd-r8871621011.html",
        "https://www.maseratistore.com/us_en/watches/successo-watch-r8871621013.html",
        "https://www.maseratistore.com/us_en/watches/sfida-watch-grey-gun-pvd-r8873640001.html",
        "https://www.maseratistore.com/us_en/watches/sfida-watch-r8873640003.html",
        "https://www.maseratistore.com/us_en/watches/epoca-lady-rose-gold-pvd-watch-r8873618009.html",
        "https://www.maseratistore.com/us_en/watches/epoca-pvd-grey-gun-watch-r8873618008.html",
        "https://www.maseratistore.com/us_en/watches/successo-watch-r8853121006.html",
        "https://www.maseratistore.com/us_en/watches/successo-pvd-grey-gun-watch-r8823121001.html",
        "https://www.maseratistore.com/us_en/watches/successo-watch-r8853121005.html",
        "https://www.maseratistore.com/us_en/watches/traguardo-blue-ip-watch-r8821112005.html",
        "https://www.maseratistore.com/us_en/watches/blue-edition-watch-blue-ip-r8853141001.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-hybrid-r88511120.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-hybrid-r88511120-51043.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-sfida-r887364000.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-sfida-r887164000.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-comp-lady-r88531.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-comp-lady-r88531-51057.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-stile-r885314200.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-stile-r882114200.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-stile-r887364200.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-stile-r885314200-51037.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-stile-r887164200.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-solar-r887364500.html",
        "https://www.maseratistore.com/us_en/ss21-orologio-solar-r887364500-51060.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-solar-r887364500-51060.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-solar-r887364500-51046.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orolog-solar-r8853145501.html",
        "https://www.maseratistore.com/us_en/ss21-orolog-solar-r8853145504.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orolog-solar-r8853145504.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orolog-solar-r8853145506.html",
        "https://www.maseratistore.com/us_en/ss21-orologio-aqua-r8873644001.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-aqua-r8873644001.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-aqua-r8873644002.html",
        "https://www.maseratistore.com/us_en/watches/ss21-orologio-aqua-r8873644003.html"
    ]
    for (let i = 0; i < u.length; i++) {
        const ex = await extraction({
            entry: u[i],
            client: axios,
        })
        console.log(ex.description);
        console.log(ex.spec);
    }
    console.log();
    console.log('done.');
    process.exit(0)
})()