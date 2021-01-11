import cheerio from 'cheerio';
import { EMPTY, Observable } from "rxjs";
import { delay, expand, map } from "rxjs/operators";
import { Mappers } from "../utils";
import { Logger } from '@cosmos/logger';
const logger = Logger.getLogger('cs:syno:Ball', 'debug')

const _indexing = (context) => {
  return new Observable(observer => {
    const { client, base, } = context;
    let { idx, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Ball";
    const brandID = 188;
    const payload = { source, lang, brand, brandID, collections: [], items: {} };
    const collections = [];
    // {
    //   const entry = 'https://www.ballwatch.com/global/en/sitemap.html';
    //   client.get(entry).then(res => {
    //     const $ = cheerio.load(res.data);
    //     $('.sitemap-list.col1-4').each((idx, el) => {
    //       const collection = $(el).find('.sitemap-list-title').text().trim();
    //       if (collections.indexOf(collection) < 0) {
    //         collections.push(collection);
    //         payload.collections.push(collection);
    //         payload.items[collection] = [];
    //       }
    //       $(el).find('li').each((idx, el) => {
    //         const name = $(el).text().trim().toUpperCase();
    //         const url = $(el).find('a').attr('href');
    //         const u = url.split('/');
    //         const nref = u[u.length - 1].split('---');
    //         const ref = nref[1].toUpperCase();
    //         const reference = (ref[0] === '-') ? ref.slice(1, ref.length) : ref;
    //         payload.items[collection].push({
    //           source, lang, brand, brandID, url, collection, name, reference, retail: null,
    //         });
    //       })
    //     })
    //     const result = {
    //       replyTo: context.replyTo,
    //       correlationId: context.correlationId,
    //       payload,
    //     }
    //     observer.next({ ...context, result });
    //     // observer.complete();
    //   })
    // }
    // {
    //   const entry = 'https://shop.ballwatch.ch/en/watchfinder';
    //   client.get(entry).then(res => {
    //     const $ = cheerio.load(res.data);
    //     const lastp = $('.pagination').find('li').last().find('a').attr('href');
    //     const lastpage = parseInt(lastp.match(/\d{1,3}/g)[0])
    //     const entry1 = "https://shop.ballwatch.ch/en/watchfinder?page=";
    //     for (let i = 1; i <= lastpage; i++) {
    //       const link = entry1 + i;
    //       logger.debug(link);
    //       client.get(link).then(res => {
    //         const $ = cheerio.load(res.data);
    //         $('.col-6.col-lg-4').each((idx, el) => {
    //           const url = $(el).find('a').attr('href');
    //           const name = $(el).find('.wic--name').text();
    //           let collection = 'others';
    //           collections.forEach(val => {
    //             if (name.match(new RegExp(val, 'i'))) {
    //               collection = val;
    //             }
    //           })
    //           if (!(name.match(/strap/i))) {
    //             let reference = '';
    //             if (url.match(/model=/i)) {
    //               reference = url.split('model=')[1].toUpperCase();
    //             } else {
    //               const u = url.split('/');
    //               const r = u[u.length - 1].split('-');
    //               if (r.length === 4)
    //                 reference = (r[1] + '-' + r[2] + '-' + r[3]).toUpperCase();
    //               else if (r.length === 3)
    //                 reference = (r[0] + '-' + r[1] + '-' + r[2]).toUpperCase();
    //               else
    //                 reference = r.join('-');
    //             }
    //             const thumbnail = $(el).find('img').attr('src');
    //             const retail = $(el).find('.wic--price').text();
    //             if (!payload.items[collection]) payload.items[collection] = [];
    //             payload.items[collection].push({
    //               source, lang, brand, brandID, collection, url, name, reference, retail, thumbnail,
    //             })
    //           }
    //         })
    //         const result = {
    //           replyTo: context.replyTo,
    //           correlationId: context.correlationId,
    //           payload,
    //         }
    //         observer.next({ ...context, result });
    //         // observer.complete();
    //       })
    //     }
    //   })
    // }
    console.log('......idx: ', idx)
    if (isNaN(idx)) {
      const entry = 'https://shop.ballwatch.ch/en/watchfinder';
      client.get(entry).then(res => {
        const $ = cheerio.load(res.data);
        const lastp = $('.pagination').find('li').last().find('a').attr('href');
        const lastpage = parseInt(lastp.match(/\d{1,3}/g)[0]);
        observer.next({ ...context, lastpage, })
        // observer.complete();
      })
    } else {
      const entry = "https://shop.ballwatch.ch/en/watchfinder?page=" + idx;
      logger.debug('entry : ', entry);
      client.get(entry).then(res => {
        const $ = cheerio.load(res.data);
        $('.col-6.col-lg-4').each((idx, el) => {
          const url = $(el).find('a').attr('href');
          const name = $(el).find('.wic--name').text();
          let collection = 'others';
          collections.forEach(val => {
            if (name.match(new RegExp(val, 'i'))) {
              collection = val;
            }
          })
          if (!(name.match(/strap/i))) {
            let reference = '';
            if (url.match(/model=/i)) {
              reference = url.split('model=')[1].toUpperCase();
            } else {
              const u = url.split('/');
              const r = u[u.length - 1].split('-');
              if (r.length === 4)
                reference = (r[1] + '-' + r[2] + '-' + r[3]).toUpperCase();
              else if (r.length === 3)
                reference = (r[0] + '-' + r[1] + '-' + r[2]).toUpperCase();
              else
                reference = r.join('-');
            }
            const thumbnail = $(el).find('img').attr('src');
            const retail = $(el).find('.wic--price').text();
            if (!payload.items[collection]) payload.items[collection] = [];
            payload.items[collection].push({
              source, lang, brand, brandID, collection, url, name, reference, retail, thumbnail,
            })
          }
        })
        const result = {
          replyTo: context.replyTo,
          correlationId: context.correlationId,
          payload,
        }
        observer.next({ ...context, result });
        observer.complete();
      })
    }
  })
};

export const newIndexing = (context) => {
  return _indexing(context)
    .pipe(
      expand<any>((context, idx): any => {
        return context.lastpage && context.lastpage < idx + 1 ? EMPTY :
          _indexing({ ...context, idx: idx + 1 })
            .pipe(delay(1000));
      }),
      map(r => r.result)
    );
};

export const indexing = async (context) => {
  try {
    const { client, base, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Ball";
    const brandID = 188;
    const result: any = { source, lang, brand, brandID, collections: [], items: {} };
    const collections = [];
    {
      const entry = 'https://www.ballwatch.com/global/en/sitemap.html';
      const { data } = await client.get(entry);
      const $ = cheerio.load(data);
      $('.sitemap-list.col1-4').each((idx, el) => {
        const collection = $(el).find('.sitemap-list-title').text().trim();
        if (collections.indexOf(collection) < 0) {
          collections.push(collection);
          result.collections.push(collection);
          result.items[collection] = [];
        }
        $(el).find('li').each((idx, el) => {
          const name = $(el).text().trim().toUpperCase();
          const url = $(el).find('a').attr('href');
          const u = url.split('/');
          const nref = u[u.length - 1].split('---');
          const ref = nref[1].toUpperCase();
          const reference = (ref[0] === '-') ? ref.slice(1, ref.length) : ref;
          result.items[collection].push({
            source, lang, brand, brandID, url, collection, name, reference, retail: null,
          });
        })
      })
    }
    {
      const entry = 'https://shop.ballwatch.ch/en/watchfinder';
      const { data } = await client.get(entry);
      const $ = cheerio.load(data);
      const lastp = $('.pagination').find('li').last().find('a').attr('href');
      const lastpage = parseInt(lastp.match(/\d{1,3}/g)[0])
      const entry1 = "https://shop.ballwatch.ch/en/watchfinder?page=";
      for (let i = 1; i <= lastpage; i++) {
        const link = entry1 + i;
        logger.debug(link);
        const { data } = await client.get(link);
        const $ = cheerio.load(data);
        $('.col-6.col-lg-4').each((idx, el) => {
          const url = $(el).find('a').attr('href');
          const name = $(el).find('.wic--name').text();
          let collection = 'others';
          collections.forEach(val => {
            if (name.match(new RegExp(val, 'i'))) {
              collection = val;
            }
          })
          if (!(name.match(/strap/i))) {
            let reference = '';
            if (url.match(/model=/i)) {
              reference = url.split('model=')[1].toUpperCase();
            } else {
              const u = url.split('/');
              const r = u[u.length - 1].split('-');
              if (r.length === 4)
                reference = (r[1] + '-' + r[2] + '-' + r[3]).toUpperCase();
              else if (r.length === 3)
                reference = (r[0] + '-' + r[1] + '-' + r[2]).toUpperCase();
              else
                reference = r.join('-');
            }
            const thumbnail = $(el).find('img').attr('src');
            const retail = $(el).find('.wic--price').text();
            if (!result.items[collection]) result.items[collection] = [];
            result.items[collection].push({
              source, lang, brand, brandID, collection, url, name, reference, retail, thumbnail,
            })
          }
        })
      }
    }
    return result;
  } catch (error) {
    logger.error('Failed indexing for Ball with error : ' + error)
    return {};
  }
};

export const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result: any = { ...rest, url: entry, spec: [], related: [], }
  try {
    const data = (await client.get(entry)).data;
    const $ = cheerio.load(data);
    if (entry.match(/shop/i)) {
      const keys = [];
      const values = [];
      result.reference = $('.ciopmodel').first().text().trim();
      result.retail = $('.product-price').first().text().trim();
      result.name = $('.cioptitle').first().text().trim();
      result.thumbnail = $(".product-main--image").first().find("img").attr("src");
      $('.product-description-content').first().find('h6').each((idx, el) => {
        keys.push($(el).text().trim());
      })
      $('.product-description-content').first().find('ul').each((idx, el) => {
        const id = idx;
        $(el).find('li').each((idx, eli) => {
          const value = $(eli).text().trim();
          values.push({ id, value })
        })
      })
      values.forEach(val => {
        result.spec.push({ key: keys[val.id], value: val.value });
      })
    } else {
      result.thumbnail = $('#collectionInfoBox').find('img').first().attr('src');
      result.reference = $(".watchitem").find(".watch-no").text();
      result.name = $(".watchitem").find(".watch-title").text() + ' ' + $(".watchitem").find(".watch-type").text()
      result.collection = $(".watchitem").find(".watch-title").text();
      let key = ""; let value = "";
      $('.watch-info > p').each((idx, el) => {
        if (idx % 2 === 0) {
          key = $(el).text().trim();
        } else {
          value = $(el).text().trim();
          result.spec.push({ key, value });
        }
      })
      $('#otherviewCarousel').find('p').each((idx, el) => {
        const url = $(el).find('a').attr('href');
        const u = url.split('/');
        const ref = u[u.length - 1].split('---')[1].toUpperCase();
        result.related.push(ref);
      })
    }
  } catch (error) {
    logger.error('Failed extraction for Ball with error : ' + error);
    logger.error('url:', entry);
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
      case: {}, band: {}, dial: {},
      caliber: {}, bezel: {}, additional: [],
    };

    for (const s of spec) {
      const key = s.key.toLowerCase();
      const value = s.value.trim();
      let assigned = false;

      if (key.match(/Water Resistance/i)) {
        assigned = true;
        result.case.waterResistance = value;
        result.waterResistance = Mappers.getWaterResistance.map(value);
      }
      if (key === 'size (case)') {
        if (value.match(/Ø|height|mm/i)) {
          assigned = true;
          const v = value.split(' or ');
          if (v.length > 1)
            for (let i = 1; i < v.length; i++) {
              result.additional.push({ 'altCaseSize': v[i] });
            }
          result.case.diameter = v[0].match(/Ø ?\d\d.?\d{0,2} ?mm/gi)[0].replace('Ø', '').trim();
          result.case.thickness = v[0].match(/, ?(height)? ?\d\d.?\d{0,2} ?mm?/gi)[0].replace(/, ?(height)? ?/i, '').trim();
        } else if (value.match(/bezel/i)) {
          const r = Mappers.getBezel.map(value);
          if (r) {
            assigned = true;
            result.bezel.type = r;
          }
        }
      }
      if (key === 'lug width') {
        assigned = true;
        const v = value.split(' ')[0];
        result.case.lugWidth = v.match(/mm/i) ? v : v + 'mm';
      }
      if (key === 'limited edition') {
        assigned = true;
        result.limited = true;
      }
      if (key === 'band' || key === 'bracelet') {
        assigned = true;
        const v = value.split(' or ');
        if (v.length > 1) {
          for (let i = 1; i < v.length; i++) {
            result.additional.push({ 'altBand': v[i] })
          }
        }
        const vv = v[0].split(' with ');
        const { bm, bms, bt, } = Mappers.getMaterial.map(vv[0]);
        if (bm) {
          result.band.type = bt;
          result.band.material = bm;
          result.band.materials = bms;
        }
        if (vv.length === 2) {
          const r = Mappers.getBuckle.map(vv[1]);
          if (r) result.band.buckle = r;
        }
      }
      if (key === 'buckle') {
        assigned = true;
        let band = value;
        let v = value.match(/,|\//g);
        if (v) {
          v = value.split(v[0]);
          if (v.length > 1)
            for (let i = 1; i < v.length; i++) {
              result.addition.push({ 'altBuckle': v[i] });
            }
          band = v[0]
        }
        if (band.match(/ or /)) {
          if (band.match(/^\w+ or \w+/)) {
            band = band.split(' or ')[1];
          } else {
            band = band.split(' or ')[0];
          }
        }
        band = band.split(' with ');
        const { bm, bms, bt, } = Mappers.getMaterial.map(band[0]);
        if (bm) {
          result.band.type = bt;
          result.band.material = bm;
          result.band.materials = bms;
        }
        const r = Mappers.getBuckle.map(band[1]);
        if (r) {
          result.band.buckle = r;
        }
      }
      if (key === 'case' || key === 'case material') {
        let isCase = true;
        const v = value.split('◆');
        v.forEach(value => {
          if (value.match(/crystal/i) && !value.match(/case/i)) {
            isCase = false;
            const r = Mappers.getCrystal.map(value);
            const cc = Mappers.getCrystalCoating.map(value);
            if (r) {
              assigned = true;
              result.case.crystal = r;
            }
            if (cc) {
              assigned = true;
              result.case.crystalCoating = cc;
            }
          }
          if (value.match(/crown?/i)) {
            isCase = false;
            const r = Mappers.getCaseCrown.map(value);
            if (r) {
              assigned = true;
              result.case.crown = r;
            }
          }
          if (value.match(/bezel/i)) {
            isCase = false;
            const r = Mappers.getBezel.map(value);
            if (r) {
              assigned = true;
              result.bezel.type = r;
            }
            const { bm, bms, } = Mappers.getMaterial.map(value);
            if (bm) {
              assigned = true;
              result.bezel.material = bm;
              result.bezel.material = bms;
            }
          }
        })
        if (value.match(/shield|patent/i)) {
          assigned = true;
          isCase = false;
          result.features.push(value);
        }
        if (value.match(/case ?back/i)) {
          isCase = false;
          const r = Mappers.getCaseBack.map(value);
          if (r) {
            assigned = true;
            result.case.back = r;
          }
        }
        if (isCase) {
          const { bm, bms, } = Mappers.getMaterial.map(value);
          if (bm) {
            assigned = true;
            result.case.material = bm;
            result.case.materials = bms;
          }
          if (value.match(/ x /i)) {
            const s = value.match(/\d{2}.?\d{0,2} ?(mm)? ?x ?\d{2}.?\d{0,2} ?mm/gi);
            if (s) result.case.size = s[0];
          }
          if (value.match(/height/i)) {
            const h = value.match(/height ?\d{1,2}.?\d{0,2} ?mm/gi);
            if (h) result.case.thickness = h[0].replace('height', '').trim();
          }
          if (value.match(/Ø/)) {
            const d = value.match(/Ø ?\d\d.?\d{0,2} ?mm/gi)[0].replace('Ø', '').trim();
            if (d) result.case.diameter = d;
          }
        }
      }
      if (key === 'crown') {
        assigned = true;
        if (value.match(/shield|patent/i)) {
          assigned = true;
          result.features.push(value);
        } else {
          const r = Mappers.getCaseCrown.map(value);
          if (r) {
            assigned = true;
            result.case.crown = r;
          }
        }
      }
      if (key === 'crystal') {
        assigned = true;
        const c = Mappers.getCrystal.map(value);
        const cc = Mappers.getCrystalCoating.map(value);
        if (c) {
          assigned = true;
          result.case.crystal = c;
        }
        if (cc) {
          assigned = true;
          result.case.crystalCoating = cc;
        }
      }
      if (key === 'function' || key === 'functions') {
        assigned = true;
        const v = value.split('◆');
        for (let i = 0; i < v.length; i++) {
          if (v[i]) {
            result.functions.push(v[i].trim());
          }
        }
      }
      if (key === 'movement') {
        assigned = true;
        let isFeature = true;
        const v = value.split('◆');
        for (let i = 0; i < v.length; i++) {
          if (v[i]) {
            if (v[i].match(/,/)) {
              const vv = v[i].split(',');
              vv.forEach(vv => v.push(vv));
            }
            if (v[i].match(/power reserve/i)) {
              const pr = v[i].match(/\d{2,3} ?hours?(?= power reserve)/gi);
              if (pr) {
                result.caliber.reserve = pr;
                isFeature = false;
              }
            }
            if (v[i].match(/vph/i)) {
              const vph = v[i].match(/\d{1,3},?\d{1,3} ?vph/gi);
              if (vph) {
                result.caliber.frequency = vph;
                isFeature = false;
              }
            }
            if (v[i].match(/caliber/i)) {
              isFeature = false;
              assigned = true;
              const c = v[i].match(/caliber (.*)/ig);
              if (c) result.caliber.reference = c[0].toUpperCase().replace('CALIBER', '').trim();
              result.caliber.brand = 'BALL';
              result.caliber.label = 'USA';
              const r = Mappers.getCaliberType.map(v[i]);
              if (r) {
                result.caliber.type = r;
                result.movementType = r;
              }
            }
            if (isFeature) result.features.push(v[i]);
          }
        }
      }
      if (key === 'dial' || key === 'dial color') {
        assigned = true;
        const v = value.split(' with ');
        const r = Mappers.getColor.map(v[0]);
        if (r) {
          result.dial.color = r;
          result.dialColor = Mappers.getDialColor.map(result.dial.color);
        }
      }
      if (!assigned) {
        if (key.match(/Anti-Magnetism|Antimagnetic/i)) {
          result.additional.push({ 'Antimagnetic': value });
        } else if (key.match(/Micro gas tubes?/i)) {
          result.additional.push({ 'Micro gas tubes': value });
        } else {
          result.additional.push({ [key]: value });
        }
      }
    }
    const g = Mappers.getGender.map(result.name);
    result.gender = g ? g : 'M';
    return result;
  } catch (error) {
    logger.debug('Failed distillation for Ball with error : ' + error)
    return {};
  }
};
