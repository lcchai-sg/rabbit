const { MongoClient } = require('mongodb');

(async () => {
  try {
    const mdb = {
      // host: "203.118.42.106",
      host: "127.0.0.1",
      port: 27017,
      user: "synopsis",
      pass: "synopsis",
      name: "synopsis",
      coll: "product",
      trColl: "translations",
    }
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    const db = conn.db(mdb.name);
    const tdy: any = new Date();
    const numDays = 1000;
    const ytd = new Date(tdy - (numDays * 24 * 60 * 60 * 1000));
    // const ytd = new Date('2000-01-01');
    console.log('reading DB..............................');
    const r = await db.collection(mdb.coll).find({ provision: 1, lastUpdatedAt: { $gt: ytd } }).toArray();
    const l = await db.collection(mdb.trColl).find().toArray();
    //band { buckle, type, color, material, materials, }
    //bezel { type, material, materials, color, }
    //case { shape, crown, coating, material, materials, back, crystal, crystalCoating, }
    //dial { type, color, handStyle, indexType, finish, +luminescence, +calendar, +subIndexType, }
    //caliber { type }
    //gender
    //style
    //+features, +feature
    const tr = {};
    l.forEach(t => {
      if (!tr[t.lang]) tr[t.lang] = {};
      const aName = t.attributeName.toLowerCase();
      if (!tr[t.lang][aName]) tr[t.lang][aName] = {};
      const aVal = t.attributeValue.toLowerCase();
      tr[t.lang][aName][aVal] = t.attributeTransValue;
    })
    for (let i = 0; i < r.length; i++) {
      const p = r[i];
      console.log(r.length, i, p.name);
      const keys = Object.keys(tr);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const pLocal = await db.collection('product_local').find({ parentID: p.id, lang: key }).toArray();
        const pl = pLocal && pLocal.length > 0 ? pLocal[0] : { parentID: p.id, lang: key, };
        const filter = pLocal && pLocal.length > 0 && pLocal[0].handledFields ? pLocal[0].handledFields : [];
        //band { color, type, buckle, material, materials, }
        if (p.band && p.band.color) {
          if (!pl.band) pl.band = {};
          if (tr[key]['band.color'] && filter.indexOf('band.color') < 0) {
            const val = p.band.color.toLowerCase();
            if (tr[key]['band.color'][val]) {
              pl.band.color = tr[key]['band.color'][val];
            }
          }
        }
        if (p.band && p.band.type) {
          if (!pl.band) pl.band = {};
          if (tr[key]['band.type'] && filter.indexOf('band.type') < 0) {
            const val = p.band.type.toLowerCase();
            if (tr[key]['band.type'][val]) {
              pl.band.type = tr[key]['band.type'][val];
            }
          }
        }
        if (p.band && p.band.buckle) {
          if (!pl.band) pl.band = {};
          if (tr[key]['band.buckle'] && filter.indexOf('band.buckle') < 0) {
            const val = p.band.buckle.toLowerCase();
            if (tr[key]['band.buckle'][val]) {
              pl.band.buckle = tr[key]['band.buckle'][val];
            }
          }
        }
        if (p.band && p.band.material) {
          if (!pl.band) pl.band = {};
          if (tr[key]['band.materials'] && filter.indexOf('band.material') < 0) {
            const val = p.band.material.toLowerCase();
            if (tr[key]['band.materials'][val]) {
              pl.band.material = tr[key]['band.materials'][val];
            }
          }
        }
        if (p.band && p.band.materials) {
          if (!pl.band) pl.band = {};
          if (filter.indexOf('band.materials') < 0 && tr[key]['band.materials']) {
            p.band.materials.forEach(m => {
              if (m && tr[key]['band.materials'][m.toLowerCase()]) {
                if (!pl.band) pl.band = {};
                if (!pl.band.materials) pl.band.materials = [];
                pl.band.materials.push(tr[key]['band.materials'][m.toLowerCase()]);
              }
            })
          }
        }
        //bezel { type, color, material, materials, }
        if (p.bezel && p.bezel.type) {
          if (!pl.bezel) pl.bezel = {};
          if (tr[key]['bezel.type'] && filter.indexOf('bezel.type') < 0) {
            const val = p.bezel.type.toLowerCase();
            if (tr[key]['bezel.type'][val]) {
              pl.bezel.type = tr[key]['bezel.type'][val];
            }
          }
        }
        if (p.bezel && p.bezel.color) {
          if (!pl.bezel) pl.bezel = {};
          if (tr[key]['bezel.color'] && filter.indexOf('bezel.color') < 0) {
            const val = p.bezel.color.toLowerCase();
            if (tr[key]['bezel.color'][val]) {
              pl.bezel.color = tr[key]['bezel.color'][val];
            }
          }
        }
        if (p.bezel && p.bezel.material) {
          if (!pl.bezel) pl.bezel = {};
          if (tr[key]['bezel.materials'] && filter.indexOf('bezel.material') < 0) {
            const val = p.bezel.material.toLowerCase();
            if (tr[key]['bezel.materials'][val]) {
              pl.bezel.material = tr[key]['bezel.materials'][val];
            }
          }
        }
        if (p.bezel && p.bezel.materials) {
          if (!pl.bezel) pl.bezel = {};
          if (filter.indexOf('bezel.materials') < 0 && tr[key]['bezel.materials']) {
            p.bezel.materials.forEach(m => {
              if (m && tr[key]['bezel.materials'][m.toLowerCase()]) {
                if (!pl.bezel) pl.bezel = {};
                if (!pl.bezel.materials) pl.bezel.materials = [];
                pl.bezel.materials.push(tr[key]['bezel.materials'][m.toLowerCase()]);
              }
            })
          }
        }
        //case { shape, crown, coating, material, materials, back, crystal, crystalCoating, }
        if (p.case && p.case.shape) {
          if (!pl.case) pl.case = {};
          if (tr[key]['case.shape'] && filter.indexOf('case.shape') < 0) {
            const val = p.case.shape.toLowerCase();
            if (tr[key]['case.shape'][val]) {
              pl.case.shape = tr[key]['case.shape'][val];
            }
          }
        }
        if (p.case && p.case.crown) {
          if (!pl.case) pl.case = {};
          if (tr[key]['case.crown'] && filter.indexOf('case.crown') < 0) {
            const val = p.case.crown.toLowerCase();
            if (tr[key]['case.crown'][val]) {
              pl.case.crown = tr[key]['case.crown'][val];
            }
          }
        }
        if (p.case && p.case.coating) {
          if (!pl.case) pl.case = {};
          if (tr[key]['case.coating'] && filter.indexOf('case.coating') < 0) {
            const val = p.case.coating.toLowerCase();
            if (tr[key]['case.coating'][val]) {
              pl.case.coating = tr[key]['case.coating'][val];
            }
          }
        }
        if (p.case && p.case.material) {
          if (!pl.case) pl.case = {};
          if (tr[key]['case.materials'] && filter.indexOf('case.material') < 0) {
            const val = p.case.material.toLowerCase();
            if (tr[key]['case.materials'][val]) {
              pl.case.material = tr[key]['case.materials'][val];
            }
          }
        }
        if (p.case && p.case.materials) {
          if (filter.indexOf('case.materials') < 0 && tr[key]['case.materials']) {
            p.case.materials.forEach(m => {
              if (m && tr[key]['case.materials'][m.toLowerCase()]) {
                if (!pl.case) pl.case = {};
                if (!pl.case.materials) pl.case.materials = [];
                pl.case.materials.push(tr[key]['case.materials'][m.toLowerCase()]);
              }
            })
          }
        }
        if (p.case && p.case.back) {
          if (!pl.case) pl.case = {};
          if (tr[key]['case.back'] && filter.indexOf('case.back') < 0) {
            const val = p.case.back.toLowerCase();
            if (tr[key]['case.back'][val]) {
              pl.case.back = tr[key]['case.back'][val];
            }
          }
        }
        if (p.case && p.case.crystal) {
          if (!pl.case) pl.case = {};
          if (tr[key]['case.crystal'] && filter.indexOf('case.crystal') < 0) {
            const val = p.case.crystal.toLowerCase();
            if (tr[key]['case.crystal'][val]) {
              pl.case.crystal = tr[key]['case.crystal'][val];
            }
          }
        }
        if (p.case && p.case.crystalCoating) {
          if (!pl.case) pl.case = {};
          if (tr[key]['case.crystalCoating'] && filter.indexOf('case.crystalCoating') < 0) {
            const val = p.case.crystalCoating.toLowerCase();
            if (tr[key]['case.crystalCoating'][val]) {
              pl.case.crystalCoating = tr[key]['case.crystalCoating'][val];
            }
          }
        }
        //dial { color, type, handStyle, indexType, finish, }
        //+luminescence, +calendar, +subIndexType, 
        if (p.dial && p.dial.luminescence) {
          if (!pl.dial) pl.dial = {};
          if (tr[key]['dial.luminescence'] && filter.indexOf('dial.luminescence') < 0) {
            const val = p.dial.luminescence.toLowerCase();
            if (tr[key]['dial.luminescence'][val]) {
              pl.dial.luminescence = tr[key]['dial.luminescence'][val];
            }
          }
        }
        if (p.dial && p.dial.calendar) {
          if (!pl.dial) pl.dial = {};
          if (tr[key]['dial.calendar'] && filter.indexOf('dial.calendar') < 0) {
            const val = p.dial.calendar.toLowerCase();
            if (tr[key]['dial.calendar'][val]) {
              pl.dial.calendar = tr[key]['dial.calendar'][val];
            }
          }
        }
        if (p.dial && p.dial.subIndexType) {
          if (!pl.dial) pl.dial = {};
          if (tr[key]['dial.subIndexType'] && filter.indexOf('dial.subIndexType') < 0) {
            const val = p.dial.subIndexType.toLowerCase();
            if (tr[key]['dial.subIndexType'][val]) {
              pl.dial.subIndexType = tr[key]['dial.subIndexType'][val];
            }
          }
        }
        if (p.dial && p.dial.color) {
          if (!pl.dial) pl.dial = {};
          if (tr[key]['dial.color'] && filter.indexOf('dial.color') < 0) {
            const val = p.dial.color.toLowerCase();
            if (tr[key]['dial.color'][val]) {
              pl.dial.color = tr[key]['dial.color'][val];
            }
          }
        }
        if (p.dial && p.dial.type) {
          if (!pl.dial) pl.dial = {};
          if (tr[key]['dial.type'] && filter.indexOf('dial.type') < 0) {
            const val = p.dial.type.toLowerCase();
            if (tr[key]['dial.type'][val]) {
              pl.dial.type = tr[key]['dial.type'][val];
            }
          }
        }
        if (p.dial && p.dial.handStyle) {
          if (!pl.dial) pl.dial = {};
          if (tr[key]['dial.handStyle'] && filter.indexOf('dial.handStyle') < 0) {
            const val = p.dial.handStyle.toLowerCase();
            if (tr[key]['dial.handStyle'][val]) {
              pl.dial.handStyle = tr[key]['dial.handStyle'][val];
            }
          }
        }
        if (p.dial && p.dial.indexType) {
          if (!pl.dial) pl.dial = {};
          if (filter.indexOf('dial.indexType') < 0) {
            const val = p.dial.indexType.toLowerCase();
            if (tr[key]['dial.indexType'] && tr[key]['dial.indexType'][val]) {
              pl.dial.indexType = tr[key]['dial.indexType'][val];
            }
          }
        }
        if (p.dial && p.dial.finish) {
          if (!pl.dial) pl.dial = {};
          if (filter.indexOf('dial.finish') < 0) {
            const val = p.dial.finish.toLowerCase();
            if (tr[key]['dial.finish'] && tr[key]['dial.finish'][val]) {
              pl.dial.finish = tr[key]['dial.finish'][val];
            }
          }
        }
        //caliber { type, }
        if (p.caliber && p.caliber.type) {
          if (!pl.caliber) pl.caliber = {};
          if (filter.indexOf('caliber.type') < 0) {
            const val = p.caliber.type.toLowerCase();
            if (tr[key]['caliber.type'] && tr[key]['caliber.type'][val]) {
              pl.caliber.type = tr[key]['caliber.type'][val];
            }
          }
        }
        if (p.gender && tr[key]['gender'] && filter.indexOf('gender') < 0 && tr[key]['gender'][p.gender]) {
          pl.gender = tr[key]['gender'][p.gender];
        }
        if (p.style && filter.indexOf('style') < 0 && tr[key]['style'] && tr[key]['style'][p.style]) {
          pl.style = tr[key]['style'][p.style];
        }
        if (p.features && tr[key]['features'] && filter.indexOf('features') < 0) {
          if (!pl.features) pl.features = [];
          p.features.forEach(value => {
            if (tr[key]['features'][value]) pl.features.push(tr[key]['features'][value]);
            else pl.features.push(value);
          })
        }
        if (p.feature && tr[key]['features'] && filter.indexOf('features') < 0) {
          if (!pl.features) pl.features = [];
          p.feature.forEach(value => {
            if (tr[key]['features'][value]) pl.features.push(tr[key]['features'][value]);
            else pl.features.push(value);
          })
        }
        if (filter.indexOf('name') < 0) pl.name = p.name;
        if (filter.indexOf('description') < 0) pl.description = p.description;
        const { parentID, lang, recordedAt, lastTransAt, ...other } = pl;
        await db.collection('product_local').findOneAndUpdate(
          { parentID, lang, },
          {
            $setOnInsert: { parentID, lang, recordedAt: new Date() },
            $set: { ...other, },
            $currentDate: { lastTransAt: { $type: 'date' } }
          },
          { upsert: true }
        )
      }
    }
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
})();
