import cheerio from "cheerio";
import Sitemapper from 'sitemapper';
import { Mappers, clearEmpties } from "../utils";
import { Logger } from '@cosmos/logger';
const logger = Logger.getLogger('cs:syno:Jomashop', 'debug')

export const indexing = async (context) => {
    const { entry, } = context;
    console.log('Jomashop indexing ...', entry)
    const source = "jomashop";
    const lang = "en";
    const result = [];
    try {
        let payload: any = { source, lang, collections: ['all'], items: { 'all': [], } };
        let sitemap = new Sitemapper({
            url: entry,
            timeout: 300000,
        });
        let data = await sitemap.fetch();
        let cnt = 0;
        for (let i = 0; i < data.sites.length; i++) {
            if (data.sites[i].match(/-watch-/i) && !(data.sites[i].match(/event|sale|gift|deal|watches/i))) {
                let u = data.sites[i].split('/');
                let d = u[u.length - 1].split('-watch-');
                const { id: brandID, name: brand } = Mappers.generateBrandID.map(data.sites[i]);
                payload.items['all'].push({
                    source, lang, brand, brandID, url: data.sites[i],
                    name: d[1].replace('.html', '').replace(new RegExp('-', 'g'), ' '),
                    reference: d[1].replace('.html', '').replace(new RegExp('-', 'g'), '.'),
                    retail: null,
                });
                cnt++;
                if (cnt % 500 === 0) {
                    result.push({ payload });
                    payload = { source, lang, collections: ['all'], items: { 'all': [], } };
                }
            }
        }
        if (payload.items['all'].length > 0) result.push({ payload });
        logger.debug('Jomashop indexing done.')
        return result;
    } catch (error) {
        logger.error('Failed indexing for Jomashop with error : ' + error)
        return {};
    }
}

const qryURL = url => {
    const v = url.split('/');
    const vv = v[v.length - 1].replace('.html', '');
    if (vv) {
        const qry = `productDetail( $urlKey : String ) {
        productDetail:products( filter: { url_key: { eq: $urlKey } } ) {
            items {
                name_wout_brand
                is_preowned
                brand_name
                model_id
                image { label url }
                upc_code
                item_variation
                moredetails {
                    description
                    more_details {
                        group_id
                        group_label
                        group_attributes {
                            attribute_id
                            attribute_label
                            attribute_value
                        }
                    }
                }
                msrp
                price_range {
                    minimum_price {
                        regular_price { value currency }
                        final_price { value currency }
                        msrp_price { value currency }
                        discount_on_msrp { amount_off percent_off }
                        discount { amount_off percent_off }
                    }
                }
            }
        }
    }&operationName=productDetail&variables={"urlKey":"${vv}"}
    `;
        return "https://www.jomashop.com/graphql?query=query " + qry;
    }
    return '';
};

export const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result: any = { ...rest, url: entry, spec: [], related: [], };
    try {
        logger.debug(entry)
        const url = entry.match(/è/) ? entry.replace(/è/g, 'e') : entry;
        let qry = qryURL(url);
        if (!qry) {
            result.code = 'not product';
            return result;
        }
        const { data } = await client.get(qry);
        if (data.data.productDetail.items.length === 0) {
            // no data found, 404
            result.code = 404;
            return result;
        }
        let d = data.data.productDetail.items[0];
        let md = d.moredetails.more_details;
        let ld = md[md.length - 1].group_attributes;
        let department = '';
        let category = '';
        for (const a of ld) {
            if (a.attribute_label === 'Department') department = a.attribute_value;
            if (a.attribute_label === 'Category') category = a.attribute_value;
        }
        if (!(department.match(/watches/i)) || !(category.match(/watches|smart watch/i))) {
            result.code = 'not product';
            return result;
        }
        result.name = d.name_wout_brand;
        const { id: bid, name: brandname } = Mappers.generateBrandID.map(d.brand_name);
        result.brand = brandname;
        result.brandID = bid;
        // result.url = entry;
        result.reference = d.model_id;
        result.thumbnail = d.image.url;
        if (d.upc_code) result.upc = d.upc_code;
        result.description = d.moredetails.description;
        let dd = d.moredetails.more_details;
        for (const g of dd) {
            const cat = g.group_label;
            for (const a of g.group_attributes) {
                const key = a.attribute_label;
                const value = a.attribute_value;
                result.spec.push({ cat, key, value });
            }
        }
        result.retail = d.msrp;
        result.currency = d.price_range.minimum_price.final_price.currency;
        result.price = d.price_range.minimum_price.final_price.value;
    } catch (error) {
        logger.error('Failed extraction for Jomashop with error : ' + error);
        logger.error('url:', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

export const distill = async (context) => {
    try {
        const { payload } = context;
        const { spec, subcollection, ...rest } = payload;
        const result: any = {
            ...rest, subcollection, functions: [], features: [],
            case: <any>{}, caliber: <any>{}, bezel: <any>{},
            dial: <any>{}, band: <any>{}, additional: [],
        };
        if (subcollection) result.subcollection = subcollection;
        for (const s of spec) {
            let assigned = false;
            const cat = s.cat.toLowerCase();
            const key = s.key.toLowerCase();
            const value = s.value && s.value.trim();
            if (cat === 'general') {
                if (key === 'band color') {
                    assigned = true;
                    // let r = Mappers.getColor.map(value);
                    // result.band.color = r ? r : value;
                    result.band.color = value;
                }
            }
            if (cat === 'information') {
                if (key === 'brand') assigned = true;
                if (key === 'engine') {
                    assigned = true;
                    result.caliber.label = value;
                }
                if (key === 'gender') {
                    assigned = true;
                    result.gender = Mappers.getGender.map(value);
                }
                if (key === 'model') {
                    assigned = true;
                    result.reference = value;
                }
                if (key === 'movement') {
                    assigned = true;
                    // let r = Mappers.getCaliberType.map(value);
                    // result.caliber.type = r ? r : value;
                    result.caliber.type = value;
                    result.movementType = result.caliber.type;
                }
                if (key === 'power reserve') {
                    assigned = true;
                    result.caliber.reserve = value;
                }
                if (key === 'series') {
                    assigned = true;
                    result.collection = value;
                }
                if (key === 'watch label') {
                    assigned = true;
                    result.caliber.label = value;
                }
            }
            if (cat === 'case') {
                if (key === 'case back') {
                    assigned = true;
                    // let r = Mappers.getCaseBack.map(value);
                    // result.case.back = r ? r : value;
                    result.case.back = value;
                }
                if (key === 'case material') {
                    assigned = true;
                    // let { bm, bms, } = Mappers.getMaterial.map(value);
                    result.case.material = value;
                    // result.case.material = bm ? bm : value;
                    // result.case.materials = bm ? bms : [value];
                    result.case.materials = [value];
                }
                if (key === 'case shape') {
                    assigned = true;
                    // let r = Mappers.getCaseShape.map(value);
                    // result.case.shape = r ? r : value;
                    result.case.shape = value;
                }
                if (key === 'case size') {
                    assigned = true;
                    result.case.size = value;
                }
                if (key === 'case thickness') {
                    assigned = true;
                    result.case.thickness = value;
                }
            }
            if (cat === 'band') {
                if (key === 'band color') {
                    assigned = true;
                    // let r = Mappers.getColor.map(value);
                    // result.band.color = r ? r : value;
                    result.band.color = value;
                }
                if (key === 'band material') {
                    assigned = true
                    // let { bm, bms, bt, } = Mappers.getMaterial.map(value);
                    // if (bt) result.band.type = bt;
                    // result.band.material = bm ? bm : value;
                    result.band.material = value;
                    // result.band.materials = bm ? bms : [value];
                    result.band.materials = [value];
                }
                if (key === 'band type') {
                    assigned = true
                    // let r = Mappers.getBandType.map(value);
                    // result.band.type = r ? r : result.band.type ? result.band.type : value;
                    result.band.type = value;
                }
                if (key === 'clasp') {
                    assigned = true
                    // let r = Mappers.getBuckle.map(value);
                    // result.band.buckle = r ? r : value;
                    result.band.buckle = value;
                }
                if (key === 'band color') {
                    assigned = true
                    // let r = Mappers.getColor.map(value);
                    // result.band.color = r ? r : value;
                    result.band.color = value;
                }
            }
            if (cat === 'dial') {
                if (key === 'bezel material') {
                    assigned = true;
                    // let { bm, bms, } = Mappers.getMaterial.map(value);
                    result.bezel.material = value;
                    // result.bezel.material = bm ? bm : value;
                    // result.bezel.materials = bm ? bms : [value];
                    result.bezel.materials = [value];
                }
                if (key === 'bezel') {
                    assigned = true;
                    // let r = Mappers.getBezel.map(value);
                    // result.bezel.type = r ? r : value;
                    result.bezel.type = value;
                }
                if (key === 'crown') {
                    assigned = true;
                    // let r = Mappers.getCaseCrown.map(value);
                    // result.case.crown = r ? r : value;
                    result.case.crown = value;
                }
                if (key === 'crystal') {
                    assigned = true;
                    // let r = Mappers.getCrystal.map(value);
                    // result.case.crystal = r ? r : value;
                    result.case.crystal = value;
                    // let cc = Mappers.getCrystalCoating.map(value);
                    // if (cc) result.case.crystalCoating = cc;
                }
                if (key === 'type') {
                    assigned = true;
                    result.dial.type = value;
                }
                if (key === 'dial color') {
                    assigned = true;
                    // let r = Mappers.getColor.map(value);
                    // result.dial.color = r ? r : value;
                    result.dial.color = value;
                    result.dialColor = Mappers.getDialColor.map(result.dial.color);
                }
                if (key === 'dial type') {
                    assigned = true;
                    // let r = Mappers.getDialType.map(value);
                    // result.dial.type = r ? r : value;
                    result.dial.type = value;
                }
                if (key === 'dial markers') {
                    assigned = true;
                    // let r = Mappers.getIndexType.map(value);
                    // result.dial.indexType = result.dial.indexType ? result.dial.indexType : r ? r : value;
                    result.dial.indexType = value;
                }
                if (key === 'hands') {
                    assigned = true;
                    // let r = Mappers.getHandStyle.map(value);
                    // result.dial.handStyle = r ? r : value;
                    result.dial.handStyle = value;
                }
                if (key === 'luminiscence') {
                    assigned = true;
                    // let r = Mappers.getLuminescence.map(value);
                    // result.dial.luminescence = r ? r : value;
                    result.dial.luminescence = value;
                }
                if (key === 'sub dials') {
                    assigned = true;
                    result.dial.subDials = value;
                }
            }
            if (cat === 'features') {
                if (key === 'water resistance') {
                    assigned = true;
                    result.case.waterResistance = value;
                    result.waterResistance = Mappers.getWaterResistance.map(value);
                }
                if (key === 'calendar') {
                    assigned = true;
                    // let r = Mappers.getCalendar.map(value);
                    // result.dial.calendar = r ? r : value;
                    result.dial.calendar = value;
                }
                if (key === 'features') {
                    assigned = true;
                    if (!result.feature) result.feature = [];
                    result.features.push(value);
                }
                if (key === 'functions') {
                    assigned = true;
                    if (!result.function) result.function = [];
                    result.functions.push(value);
                }
            }
            if (cat === 'additional info') {
                if (key === 'upc code') {
                    assigned = true;
                    result.upc = value;
                }
                if (key === 'style') {
                    assigned = true;
                    let r = Mappers.getStyle.map(value);
                    result.style = r ? r : value;
                }
            }
            if (!assigned) {
                const key = s.key.replace(":", "").trim();  // original key, not lowerCase()
                result.additional.push({ [key]: value });
            }
        }
        return result;
    } catch (error) {
        logger.error('Failed distillation for Jomashop with error : ' + error)
        return {};
    }
};
