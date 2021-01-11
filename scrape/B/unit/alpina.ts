import cheerio from 'cheerio';
import { EMPTY, Observable } from "rxjs";
import { delay, expand, map } from "rxjs/operators";
const xml2js = require('xml2js');
import { Mappers } from "../utils";
import { Logger } from '@cosmos/logger';
const logger = Logger.getLogger('cs:syno:Alpina', 'debug')

const _indexing = (context) => {
  return new Observable(observer => {
    const { client, entry, base, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Alpina";
    const brandID = 288;
    const payload = { source, lang, brand, brandID, collections: [], items: {} };
    client.get(entry).then(res => {
      const parser = new xml2js.Parser();
      parser.parseString(res.data, (err, res) => {
        for (let i = 1; i < res.urlset.url.length; i++) {
          const url = res.urlset.url[i]['loc'][0];
          const name = res.urlset.url[i]['image:image'][0]['image:title'][0];
          const thumbnail = res.urlset.url[i]['image:image'][0]['image:loc'][0];
          const ref = thumbnail.split('/');
          const refr = ref[ref.length - 1].split('?')[0];
          const reference = (refr.match(/al-\d{3}[A-z]/i)) ? refr.substr(0, 12) : null;
          const collection = name.match(/comtesse/i) ? 'COMTESSE' : name.split(' ')[0].toUpperCase();
          if (payload.collections.indexOf(collection) < 0) {
            payload.collections.push(collection);
            payload.items[collection] = [];
          }
          payload.items[collection].push({
            source, lang, brand, brandID, collection, url, name,
            reference, thumbnail, retail: null,
          })
        }
      });
      const result = {
        replyTo: context.replyTo,
        correlationId: context.correlationId,
        payload,
      }
      observer.next({ ...context, result });
      observer.complete();
    })
  })
};

export const newIndexing = (context) => {
  return _indexing(context)
    .pipe(
      expand<any>((context, idx): any => {
        return context.result ? EMPTY :
          _indexing(context)
            .pipe(delay(1000));
      }),
      map(r => r.result)
    );
};

export const indexing = async (context) => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Alpina";
  const brandID = 288;
  const result: any = { source, lang, brand, brandID, collections: [], items: {} };
  try {
    const { data } = await client.get(entry);
    const parser = new xml2js.Parser();
    parser.parseString(data, (err, res) => {
      for (let i = 1; i < res.urlset.url.length; i++) {
        const url = res.urlset.url[i]['loc'][0];
        const name = res.urlset.url[i]['image:image'][0]['image:title'][0];
        const thumbnail = res.urlset.url[i]['image:image'][0]['image:loc'][0];
        const ref = thumbnail.split('/');
        const refr = ref[ref.length - 1].split('?')[0];
        const reference = (refr.match(/al-\d{3}[A-z]/i)) ? refr.substr(0, 12) : null;
        const collection = name.match(/comtesse/i) ? 'COMTESSE' : name.split(' ')[0].toUpperCase();
        if (result.collections.indexOf(collection) < 0) {
          result.collections.push(collection);
          result.items[collection] = [];
        }
        result.items[collection].push({
          source, lang, brand, brandID, collection, url, name,
          reference, thumbnail, retail: null,
        })
      }
    });
    return result;
  } catch (error) {
    logger.error('Failed indexing for Alpina with error : ' + error)
    return {};
  }
};

export const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result: any = { ...rest, url: entry, spec: [], related: [], }
  try {
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    $('script[type="application/ld+json"]').each((idx, el) => {
      const c = $(el).contents().toString();
      const j = JSON.parse(c);
      if ((j['@type']) === 'Product') {
        j.offers.forEach(p => {
          if (p.name === 'intl') {
            result.retail = p.priceCurrency + p.price;
          }
        })
        result.reference = j.sku;
        result.name = j.name.replace(/(<([^>]+)>)/ig, '');
      }
    })
    if (result.name) {
      if (result.name.match(/comtesse/i)) result.collection = 'COMTESSE';
      else result.collection = result.name.split(' ')[0];
    }
    const c = $("#bold-platform-data").contents().toString();
    const j = JSON.parse(c);
    const values = j.product.description.split('\n');
    result.description = j.product.description.replace(/(<([^>]+)>)/ig, '');

    let cat = '';
    values.forEach(val => {
      const v = val.replace(/ data-mce-fragment=\"1\"/gi, "").replace(/ bis_skin_checked=\"1\"/gi, "");
      if (v.match(/HIGHLIGHTS/i)) cat = 'HIGHLIGHTS';
      else if (v.match(/h2/i)) cat = v.replace(/(<([^>]+)>)/ig, '');
      if (cat === '') cat = 'HIGHLIGHTS';
      if (v.match(/<p|<div/i)) {
        const vv = v.split('<br>');
        vv.forEach(val => {
          const newVal = val.replace(/(<([^>]+)>)/ig, '').split(':');
          const value = newVal[newVal.length - 1].trim();
          if (value) result.spec.push({ cat, key: newVal.length === 2 ? newVal[0] : '', value });
        })
      }
    })
  } catch (error) {
    logger.error('Failed extraction for Alpina with error : ' + error);
    logger.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

export const distill = async (context) => {
  try {
    const { payload } = context;
    const { spec, ...other } = payload;
    const result: any = {
      ...other, additional: [], functions: [], features: [],
      case: {}, band: {}, dial: {}, caliber: {}, bezel: {},
    };

    for (const s of spec) {
      let assigned = false;
      const cat = s.cat.toLowerCase();
      const key = s.key.toLowerCase();
      const value = s.value.trim();

      if (cat === 'dial' || key === 'dial' || (cat === 'highlights' && value.match(/dial/i))) {
        const v = value.split(',');
        const vv = v ? v[0].split(' with ') : null;
        if (vv && vv[0].match(/dial/i)) {
          const c = Mappers.getColor.map(vv[0]);
          result.dial.color = c ? c : vv[0].replace(' dial', '');
          result.dialColor = Mappers.getDialColor.map(result.dial.color);
        }
      }
      if (cat.match(/case/i) && value.match(/bezel/i)) {
        const r = Mappers.getBezel.map(value);
        if (r) result.bezel.type = r;
      }
      if (cat.match(/case|dial/i) && value.match(/marker|index|numeral/i)) {
        const r = Mappers.getIndexType.map(value);
        if (r) result.dial.indexType = r;
      }
      if (cat.match(/case|dial|hands/i) && value.match(/hands/i)) {
        const r = Mappers.getHandStyle.map(value);
        if (r) result.dial.handStyle = r;
      }
      if ((cat.match(/case/i) && key.match(/material/i)) || (cat.match(/case/i) && value.match(/case/i))) {
        const v = value.split(',');
        const vv = v ? v[0].split('with') : null;
        if (vv) {
          // value can be material with coating, n-parts, thickness OR
          // material with bezel OR material with coating with bezel OR
          // material with bezel, case back
          const { bm, bms, } = Mappers.getMaterial.map(vv[0]);
          if (bm) {
            assigned = (v.length === 1 && vv.length === 1);
            result.case.material = bm;
            result.case.materials = bms;
          }
          if (vv.length === 3) {
            const c = Mappers.getCoating.map(vv[1]);
            result.case.coating = c ? c : vv[1];
          }
          const bz = Mappers.getBezel.map(vv[vv.length - 1]);
          if (bz) result.bezel.type = bz;
        }
      }
      if (key === 'thickness') {
        assigned = true;
        result.case.thickness = value;
      } else if (cat.match(/case/i) && value.match(/thick/i)) {
        const th = value.match(/\d{1,2}.?\d{0,2} ?MM ?THICKNESS|THICKNESS OF \d{1,2}.?\d{0,2} ?MM/gi);
        if (th) {
          const v = th[0].match(/d{1,2}.?\d{0,2} ?MM/ig);
          if (v) result.case.thickness = v[0];
        }
      }
      if (key === 'diameter' || (cat.match(/case/i) && value.match(/diameter/i))) {
        assigned = !(value.match(/thick/i) || value.match(/,/));
        // no thickness, just diameter
        if (assigned) result.case.diameter = value;
        if (value.match(/,/)) {
          const v = value.split(',');
          // index 0 = diameter
          result.case.diameter = v[0].toUpperCase().replace('DIAMETER OF ', '');
        }
      }
      if (key === 'crown' || (key.match(/case/i) && value.match(/crown/i))) {
        assigned = !(value.match(/and/i));
        const r = Mappers.getCaseCrown.map(value);
        if (r) result.case.crown = r;
        else if (!(value.match(/and/i))) {
          result.case.crown = value;
        }
      }
      if ((cat.match(/case/i) || key.match(/case/i)) && value.match(/case[ -]?back/i)) {
        assigned = !(value.match(/,/) || value.match(/and/i));
        const r = Mappers.getCaseBack.map(value);
        if (r) result.case.back = r;
      }
      if (key === 'caliber' || (key === 'movement' && value.match(/caliber/i))) {
        assigned = true;
        const v = value.split(',');
        result.caliber.reference = v[0];
        result.caliber.brand = 'Alpina';
        result.caliber.label = 'Swiss Made';
      }
      if (key === 'winding' || key === 'caliber' || (key === 'movement' && value.match(/caliber/i))) {
        assigned = true;
        const r = Mappers.getCaliberType.map(value);
        result.caliber.type = r ? r : value;
        result.movementType = r ? r : value;
      }
      if (key === 'crystal' || key === 'glass' || (cat === 'case' && value.match(/crystal/i))) {
        assigned = true;
        const c = Mappers.getCrystal.map(value);
        const cc = Mappers.getCrystalCoating.map(value);
        result.case.crystal = c ? c : value;
        if (cc) result.case.crystalCoating = cc;
      }
      if (key.match(/strap|bracelet/i) || cat.match(/strap/i) || (cat.match(/dial/i) && value.match(/strap/i))) {
        assigned = true;
        const { bm, bms, bt, } = Mappers.getMaterial.map(value);
        if (bt) result.band.type = bt;
        result.band.material = bm ? bm : value;
        result.band.materials = bm ? bms : [value];
      }
      if (key.match(/water/i) || value.match(/WATER/i)) {
        assigned = true;
        const v = value.toLowerCase().split('up to ')
        result.case.waterResistance = value;
        result.waterResistance = Mappers.getWaterResistance.map(value);
      }
      if (key === 'frequency') {
        assigned = true;
        result.caliber.frequency = value;
      }
      if (key === 'movement' && value.match(/alt\/h/i)) {
        assigned = true;
        const freq = value.match(/\d{0,3},?\d{1,3} ?alt\/h/ig);
        if (freq) result.caliber.frequency = freq[0];
      }
      if (key === 'power reserve' || key === 'battery life' || (cat === 'movement features' && value.match(/battery life/i))) {
        assigned = true;
        result.caliber.reserve = value.replace("BATTERY LIFE", "").trim();
      }
      if (key === 'movement' && value.match(/power reserve/i)) {
        assigned = true;
        const pr = value.match(/\d{2,3}[ -]?hour/ig);
        if (pr) result.caliber.reserve = pr[0];
      }
      if (key === 'jewels') {
        assigned = true;
        result.caliber.jewels = value;
      }
      if (key === 'movement' && value.match(/jewels/i)) {
        assigned = true;
        const j = value.match(/\d{2,3} ?jewels/ig);
        if (j) {
          const nb = j[0].match(/\d{2,3}/g);
          result.caliber.reserve = nb[0];
        }
      }
      if ((cat === 'movement features' && value.match(/RECHARGEABLE BATTERY|ADJUSTABLE VIA THE CROWN/i)) || key === 'features' || key === 'protections' || (cat === 'connected features' && value.match(/compatible|cloud/i))) {
        assigned = true;
        if (result.features.indexOf(value) < 0) result.features.push(value);
      }
      if (cat.match(/dial/i)) {
        if (value.match(/date window/i)) {
          assigned = true;
          const v = value.toUpperCase();
          if (result.functions.indexOf(v)) result.functions.push(v);
        }
      }
      if (cat === 'functions' || key === 'functions') {
        assigned = true;
        if (result.functions.indexOf(value) < 0) result.functions.push(value);
      }
      if (cat === 'movement features' && (value.match(/HOURS, MINUTES, SECONDS,/i) || key === 'functions' || key === 'theme')) {
        assigned = true;
        if (result.functions.indexOf(value) < 0) result.functions.push(value);
      }

      if (!assigned) {
        if (key) result.additional.push({ [key]: value })
        else if (cat) result.additional.push({ [cat]: value })
        else result.additional.push(value);
      }
    }
    return result;
  } catch (error) {
    logger.debug('Failed distillation for Alpina with error : ' + error)
    return {};
  }
};
