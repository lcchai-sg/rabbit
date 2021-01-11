import cheerio from 'cheerio';
import { Logger } from '@cosmos/logger';
const logger = Logger.getLogger('cs:syno:WatchesofMayFair', 'debug')
import { Mappers, } from "../utils";

export const indexing = async (context) => {
    const source = "watchesofmayfair";
    const lang = "en";
    let { client, entry, } = context;
    const result = [];
    let next = entry;
    try {
        do {
            logger.debug(next);
            const payload = { source, lang, collections: ['all'], items: { 'all': [], } };
            const { data } = await client.get(next);
            const $ = cheerio.load(data);
            $(".item.product.product-item").each((idx, el) => {
                const url = $(el).find('a').attr('href');
                const thumbnail = $(el).find('img').attr('src');
                const reference = $(el).find('.span-productid').text();
                const name = $(el).find('.product-item-link').text();
                const price = $(el).find(".price-wrapper.price-including-tax").text();
                const retail = $(el).find(".price-wrapper.price-excluding-tax").text();
                const { id: brandID, name: brand } = Mappers.generateBrandID.map(url);
                payload.items['all'].push({
                    source, lang, brand, brandID, url,
                    name, reference, price, retail, thumbnail,
                });
            })
            result.push(payload)
            next = $('.pages-item-next').find('a').attr('href');
        } while (next);
        return result;

        // let sitemap = new Sitemapper({
        //     url: entry,
        //     timeout: 300000,
        // });
        // let data = await sitemap.fetch();
        // assumption: url with ...-watch-... are watches
        // assumption: url with
        // https://watchesofmayfair.com/brand/<brand>/<category>/<collection>/<name-reference>
        // /brand/ && split('/').length = 8
        // https://watchesofmayfair.com/brand/<brand>/<collection>/<name-reference>
        // /brand/ && split('/').length = 7
        // https://watchesofmayfair.com/watches/<collection>/<name-reference>
        // /watches/ && split('/').length = 6
        //
        // let cnt = 0;
        // for (let i = 0; i < data.sites.length; i++) {
        //     let u = data.sites[i];
        //     if (!(u.match(/accessories|jewellery/i))) {
        //         const { id: brandID, name: brand } = Mappers.generateBrandID.map(data.sites[i]);
        //         if (data.sites[i].match(/brand/i)) {
        //             let d = data.sites[i].split('/');
        //             if (d.length >= 7) {
        //                 payload.items['all'].push({
        //                     source, lang, brand, brandID, url: data.sites[i],
        //                     name: d[d.length - 1],
        //                     reference: d[d.length - 1],
        //                     collection: d[d.length - 2],
        //                     price: null,
        //                 });
        //                 cnt++;
        //             }
        //         } else if (data.sites[i].match(/watches/i)) {
        //             let d = data.sites[i].split('/');
        //             if (d.length >= 6) {
        //                 payload.items['all'].push({
        //                     source, lang, brand, brandID, url: data.sites[i],
        //                     name: d[d.length - 1],
        //                     reference: d[d.length - 1],
        //                     collection: d[d.length - 2],
        //                     price: null,
        //                 });
        //                 cnt++;
        //             }
        //         }
        // if (cnt % 500 === 0) {
        //     result.push({ payload });
        //     payload = { source, lang, collections: ['all'], items: { 'all': [], } };
        // }
    } catch (error) {
        logger.error('Failed indexing for WatchesofMayFair with error : ' + error)
        return {};
    }
};

export const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result: any = { ...rest, url: entry, spec: [], related: [], };
    try {
        const $ = cheerio.load((await client.get(entry)).data);
        result.reference = $('.col.data.reference-value').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        result.name = $('.page-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        result.retail = $('.price-container.price-msrp_price .price-wrapper ').text().trim();
        result.price = $(".price-wrapper price-excluding-tax").text().trim() + ' excl. tax';
        result.brand = $('.col.data.manufacturer-value ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        result.description = $('.product.attribute.overview .value').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        let { id, name: brandname } = Mappers.generateBrandID.map(result.brand);
        result.brandID = id;
        result.brand = brandname;
        let breadcrumbs = '';
        let words = [];
        $('.breadcrumbs .items li').each((idx, el) => {
            breadcrumbs = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            words.push(breadcrumbs);
        });
        if (words.length > 0) {
            if (words[1].indexOf(/brands/i) === -1) {
                if (words[5]) {
                    result.collection = words[3];
                    result.subcollection = words[4];
                } else {
                    result.collection = words[3];
                }
            }
        }
        $('.data.table.additional-attributes tr').each((idx, el) => {
            const key = $(el).find('th').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const value = $(el).find('td').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            result.spec.push({ key, value });
        });
    } catch (error) {
        logger.error('Failed extraction for WatchesofMayFair with error : ' + error);
        logger.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

export const distill = async (context) => {
    try {
        const { payload } = context;
        const { spec, ...rest } = payload;
        const result: any = {
            ...rest, functions: [], features: [],
            case: <any>{}, caliber: <any>{}, bezel: <any>{},
            dial: <any>{}, band: <any>{}, additional: [],
        };
        for (const s of spec) {
            let pp = false;
            const key = s.key.replace(":", "").toLowerCase();
            const value = s.value.trim();

            if (key === 'brand') {
                pp = true;
                result.caliber.brand = value;
            }
            if (key === 'reference') {
                pp = true;
                result.reference = value;
            }
            if (key === 'country of manufacture') {
                pp = true;
                result.caliber.label = value;
            }
            if (key === 'case material') {
                pp = true;
                if (!result.case.materials) result.case.materials = [];
                const { bm, bms } = Mappers.getMaterial.map(value);
                if (bm) {
                    result.case.material = bm;
                    bms.forEach(v => {
                        if (result.case.materials.indexOf(v) < 0) {
                            result.case.materials.push(v);
                        }
                    })
                } else {
                    result.case.material = value;
                    result.case.materials.push(value);
                }
            }
            if (key === 'case diameter (mm)') {
                pp = true;
                result.case.diameter = value;
            }
            if (key === 'case shape') {
                pp = true;
                let r = Mappers.getCaseShape.map(value);
                result.case.shape = r ? r : value;
            }
            if (key === 'thickness (mm)') {
                pp = true;
                result.case.thickness = value;
            }
            if (key === 'case back') {
                pp = true;
                let r = Mappers.getCaseBack.map(value);
                result.case.back = r ? r : value;
            }
            if (key === 'waterproof') {
                pp = true;
                result.case.waterResistance = value;
                result.waterResistance = Mappers.getWaterResistance.map(value);
            }
            if (key === 'dial') {
                pp = true;
                // dial color
                let r = Mappers.getColor.map(value);
                result.dial.color = r ? r : value;
                result.dialColor = Mappers.getDialColor.map(result.dial.color);
            }
            if (key === 'movement') {
                pp = true;
                let r = Mappers.getCaliberType.map(value);
                result.caliber.type = r ? r : value;
                result.movementType = result.caliber.type;
            }
            if (key === 'movement calibre') {
                pp = true;
                result.caliber.reference = value;
            }
            if (key === 'power reserve (h)') {
                pp = true;
                result.caliber.reserve = value;
            }
            if (key === 'no. of jewels') {
                pp = true;
                result.caliber.jewels = value;
            }
            if (key === 'frequency') {
                pp = true;
                result.caliber.frequency = value;
            }
            if (key === 'strap material') {
                pp = true;
                if (!result.band.materials) result.band.materials = [];
                const { bm, bms, bt, } = Mappers.getMaterial.map(value);
                if (bm) {
                    result.band.type = bt;
                    result.band.material = result.band.material ? result.band.material : bm;
                    bms.forEach(v => {
                        if (result.band.materials.indexOf(v) < 0) {
                            result.band.materials.push(v);
                        }
                    })
                } else {
                    result.band.material = value;
                    result.band.materials.push(value);
                }
            }
            if (key === 'clasp (buckle)') {
                pp = true;
                let r = Mappers.getBuckle.map(value);
                result.band.buckle = r ? r : value;
            }
            if (key === 'crown') {
                pp = true;
                let r = Mappers.getCaseCrown.map(value);
                result.case.crown = r ? r : value;
            }
            if (key === 'warranty') {
                pp = true;
                result.warranty = parseInt(value.replace(/\D/g, ''));
            }
            if (!pp) result.additional.push({ [key]: value });
        }
        return result;
    } catch (error) {
        logger.error('Failed distillation for WatchesofMayFair with error : ' + error);
        return {};
    }
};
