const axios = require('axios');
const cheerio = require('cheerio');
const urls = [
    "https://www.iwc.com/en/past-collections/aquatimer/iw372301-aquatimer-split-minute-chronograph.html",
    "https://www.iwc.com/en/past-collections/aquatimer/iw378101-aquatimer-chronograph-cousteau-divers.html",
    "https://www.iwc.com/en/past-collections/aquatimer/iw378203-aquatimer-chronograph-cousteau-divers.html",
    "https://www.iwc.com/en/watch-collections/pilot-watches/iw389107-pilot_s-watch-chronograph-edition-royal-maces.html",
    "https://www.iwc.com/en/watch-collections/pilot-watches/iw389108-pilot_s-watch-chronograph-edition-tophatters.html",
    "https://www.iwc.com/en/watch-collections/pilot-watches/iw389109-pilot_s-watch-chronograph-edition-blue-angels.html",
    "https://www.iwc.com/en/past-collections/portofino/iw356524-portofino-automatic-edition-1881-heritage-boutique.html",
    "https://www.iwc.com/en/watch-collections/portofino/iw458120-portofino-automatic-37-edition-net-a-porter.html"
];

const extraction = async (context) => {
    const { client, entry, base, ...rest } = context;
    const baseURL = base ? base : "https://www.iwc.com";
    const result = { ...rest, url: entry, spec: [], related: [] };
    result.source = 'official';
    result.lang = 'en';
    result.brand = 'IWC';
    result.brandID = 4;
    try {
        const res = await client.get(entry);
        const cUrl = res.request.res.responseUrl;
        if (cUrl != entry) {
            result.code = 404;
            return;
        }
        const { data: rd } = res;
        const $ = cheerio.load(rd);
        const reference = $('.iwc-buying-options-reference').text().trim();
        result.name = $('.iwc-buying-options-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Add to my wishlist', '').trim();
        result.reference = reference;
        result.gender = 'M';
        result.thumbnail = $(".iwc-adaptive-image").attr('srcset');
        if (!result.thumbnail) result.thumbnail = $(".iwc-buying-options-carousel").find("img").first().attr("src");
        if (result.thumbnail) result.thumbnail = baseURL + result.thumbnail;
        const pInfo = entry.replace('.html', '.productinfo.US.json');
        const { data } = await client.get(pInfo);
        const pd = JSON.parse(JSON.stringify(data));
        const pkey = 'IW' + reference;
        result.retail = pd[pkey].formattedPrice;
        $(".iwc-product-link.rcms_productrelated").each((idx, el) => {
            result.related.push($(el).attr('data-tracking-related'));
        });
        result.description = $(".iwc-buying-options-text").text().replace(/\s+/g, " ").trim();
        $(".iwc-product-text").each((idx, el) => {
            const key = $(el).find(".iwc-product-information-title").first().text();
            $(el).find(".iwc-product-detail-item").each((idx, el) => {
                const value = $(el).text().replace(/\s+/g, ' ').trim();
                result.spec.push({ key, value });
            })
        })
    } catch (error) {
        console.error('Failed extraction for IWC with error : ' + error);
        if (error.response) result.code = error.response.status;
        else console.log(error);
    }
    return result;
};

(async () => {
    const spec = [];
    for (let i = 0; i < urls.length; i++) {
        const ex = await extraction({
            client: axios,
            entry: urls[i]
        })
        ex.spec.forEach(r => {
            const sp = r.key + " | " + r.value;
            if (spec.indexOf(sp) < 0) spec.push(sp);
        })
    }
    spec.sort().forEach(r => { console.log(r); });
    console.log();
    console.log('done......................');
})();