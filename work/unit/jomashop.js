const cheerio = require("cheerio");

const generateBrandID = input => {
    if (!input) return null;

    if (input.match(/suunto/i)) {
        return 184;
    }
    if (input.match(/cvstos/i)) {
        return 186;
    }
    if (input.match(/ball/i)) {
        return 188;
    }
    if (input.match(/baume et mercier|baumeetmercier|baume-et-mercier|baumemercier|baume-mercier/i)) {
        return 178;
    }
    if (input.match(/gerald genta|geraldgenta|gerald-genta/i)) {
        return 176;
    }
    if (input.match(/sinn/i)) {
        return 180;
    }
    if (input.match(/rolex/i)) {
        return 1;
    }
    if (input.match(/tudor/i)) {
        return 2;
    }
    if (input.match(/aboutvintage|about vintage|about-vintage/i)) {
        return 152;
    }
    if (input.match(/audemarspiguet|audemars piguet|audemars-piguet/i)) {
        return 18;
    }
    if (input.match(/bellross|bell ross|bell-ross|bell&ross|bell & ross/i)) {
        return 112;
    }
    if (input.match(/blancpain/i)) {
        return 52;
    }
    if (input.match(/breguet/i)) {
        return 132;
    }
    if (input.match(/breitling/i)) {
        return 118;
    }
    if (input.match(/bulgari|bvlgari/i)) {
        return 32;
    }
    if (input.match(/cartier/i)) {
        return 28;
    }
    if (input.match(/casio/i)) {
        return 76;
    }
    if (input.match(/chanel/i)) {
        return 70;
    }
    if (input.match(/chopard/i)) {
        return 44;
    }
    if (input.match(/citizen/i)) {
        return 86;
    }
    if (input.match(/frédérique constant|frederiqueconstant|frederique constant|frederique-constant/i)) {
        return 154;
    }
    if (input.match(/gagamilano|gaga milano|gaga-milano/i)) {
        return 96;
    }
    if (input.match(/girardperregaux|girard perregaux|girard-perregaux/i)) {
        return 98;
    }
    if (input.match(/glashuette/i)) {
        return 168;
    }
    if (input.match(/grand-seiko|grandseiko|grand seiko/i)) {
        return 84;
    }
    if (input.match(/gucci/i)) {
        return 156;
    }
    if (input.match(/hamilton/i)) {
        return 62;
    }
    if (input.match(/hermes/i)) {
        return 64;
    }
    if (input.match(/hublot/i)) {
        return 46;
    }
    if (input.match(/iwc/i)) {
        return 4;
    }
    if (input.match(/jaegerlecoultre|jaeger lecoultre|jaeger-lecoultre/i)) {
        return 16;
    }
    if (input.match(/jaquetdroz|jaquet droz|jaquet-droz/i)) {
        return 174;
    }
    if (input.match(/longines/i)) {
        return 120;
    }
    if (input.match(/mauricelacroix|maurice lacroix|maurice-lacroix/i)) {
        return 26;
    }
    if (input.match(/montblanc/i)) {
        return 5;
    }
    if (input.match(/nomos glashütte|nomosglashuette|nomos glashuette|nomos-glashuette/i)) {
        return 134;
    }
    if (input.match(/omega/i)) {
        return 20;
    }
    if (input.match(/orient/i)) {
        return 100;
    }
    if (input.match(/oris/i)) {
        return 164;
    }
    if (input.match(/panerai/i)) {
        return 58;
    }
    if (input.match(/parmigiani/i)) {
        return 158;
    }
    if (input.match(/patek/i)) {
        return 22;
    }
    if (input.match(/piaget/i)) {
        return 56;
    }
    if (input.match(/rado/i)) {
        return 160;
    }
    if (input.match(/seiko/i)) {
        return 72;
    }
    if (input.match(/sevenfriday|seven friday|seven-friday/i)) {
        return 142;
    }
    if (input.match(/tagheuer|tag heuer|tag-heuer/i)) {
        return 54;
    }
    if (input.match(/tissot/i)) {
        return 82;
    }
    if (input.match(/ulysse|ulysse-nardin|ulysse nardin/i)) {
        return 162;
    }
    if (input.match(/vacheronconstantin|vacheron constantin|vacheron-constantin/i)) {
        return 3;
    }
    if (input.match(/zenith/i)) {
        return 80;
    }
    if (input.match(/mido/i)) {
        return 172;
    }
    if (input.match(/franck muller|franck-muller|franckmuller/i)) {
        return 30;
    }
    if (input.match(/louis vuitton|louis-vuitton|louisvuitton/i)) {
        return 130;
    }
    return null;
}

const extraction = async (context) => {
    try {
        const { client, entry, lang, brand, brandID, productID, thumbnail } = context;
        console.debug(entry)
        const result = {
            source: 'jomashop',
            url: entry,
            reference: "",
            brand,
            brandID,
            productID,
            lang,
            scripts: [],
            spec: [],
            related: []
        };
        const d = (await client.get(entry)).data;
        if (d.match(/out of stock/i)) {
            console.debug('out of stock', entry);
            return { ...result, code: "out of stock", };
        }
        const $ = cheerio.load(d);
        let breadcrumbs = '';
        let words = [];
        $('.wrapper .page .breadcrumbs').each((idx, el) => {
            if (idx === 0) {
                breadcrumbs = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
                breadcrumbs.split('/').map((text) => {
                    words.push(text.trim())
                });
            }
        });
        if (words.length > 0) {
            if (words[1].indexOf(/watches/i) === -1) {
                if (words[5]) {
                    result.collection = words[3];
                    result.subcollection = words[4];
                }
                else {
                    result.collection = words[3];
                }
            }
        }
        result.thumbnail = thumbnail;
        result.reference = $('#attribute-id-internal-id').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        result.name = $('.product-name ').text().split(/\r?\n/)[1].trim() ? $('.product-name ').text().split(/\r?\n/)[1].trim() : '';
        result.brand = $('.brand-name').text().split(/\r?\n/)[1].trim() ? $('.brand-name').text().split(/\r?\n/)[1].trim() : '';
        result.retail = $('.pdp-retail-price ').text().trim().replace('retail:', '');
        result.price = $('.final-price ').text().trim() ? $('.final-price ').text().trim() : '';
        result.description = $('.product-description ').text().trim() ? $('.product-description ').text().trim() : '';
        result.brandID = generateBrandID(result.brand);

        $('.attribute-group').each((idx, el) => {
            let key = '';
            let value = '';
            const keys = [];
            const values = [];
            const group = $(el).find('h3').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            $(el).find('label').each((idx, el) => {
                key = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
                keys.push(key);
            });
            $(el).find('div').each((idx, el) => {
                value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
                values.push(value);
            });
            keys.map((key, i) => {
                const value = values[i];
                result.spec.push({ group, key, value });
            });
        });
        return result;
    } catch (error) {
        const { entry, lang, } = context;
        console.error('Failed extraction for Jomashop with error : ' + error);
        return { source: 'jomashop', url: entry, lang, code: error.response.status, }
    }
};

module.exports = { extraction };