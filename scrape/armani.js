const axios = require('axios');
const cheerio = require('cheerio');
const urls = [
    'https://www.armani.com/en-us/two-hand-rose-gold-tone-stainless-steel-watch_cod17411127376040916.html',
    'https://www.armani.com/en-us/two-hand-rose-gold-tone-stainless-steel-watch_cod17411127376040912.html',
    'https://www.armani.com/en-us/quartz-leather-watch_cod17411127376153923.html',
    'https://www.armani.com/en-us/two-hand-black-leather-watch_cod17266703523686871.html',
];

const extraction = async context => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], }
    result.source = "official";
    result.lang = "en";
    result.brand = "Emporio Armani";
    result.brandID = 218;
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        // const title = $('meta[property="og:title"]').attr('content');
        // if (title) {
        //     const g = Mappers.getGender.map(title);
        //     result.gender = g ? g : 'M';
        // }
        $('script[type="application/ld+json"]').each((idx, el) => {
            const j = JSON.parse($(el).contents().toString());
            if (j.length) {
                const jj = j[0];
                result.name = jj.name;
                if (jj.image) result.thumbnail = jj.image[0];
                if (jj.offers) result.retail = jj.offers[0].priceCurrency + ' ' + jj.offers[0].price;
                if (jj.offers && jj.offers[0].sku) result.sku = jj.offers[0].sku;
            }
        })
        result.description = $('.EditorialDescription').text().trim();
        if (!result.thumbnail) result.thumbnail = $('meta[property="og:image"]').attr('content');
        if (!result.description) result.description = $('meta[property="og:description"]').attr('content');
        result.reference = $('.mfPartNumber').find('.value').text().trim();
        let key = $(".item-shop-panel__details").find("h4").first().text().trim();
        let value = $(".item-shop-panel__details").find("p").first().text().trim();
        result.spec.push({ key, value });
        key = "detailsInfo";
        const val = $(".TechnicalDescription").find(".value").contents();
        val.toString().split("<br>").forEach(value => {
            if (value) result.spec.push({ key, value });
        })
    } catch (error) {
        console.error(error);
    }
    return result;
}

(async () => {
    for (const u of urls) {
        const ex = await extraction({
            client: axios,
            entry: u,
        });
        console.log(ex);
    }
})()