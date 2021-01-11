const { MongoClient } = require('mongodb');
// const { Mappers } = require('./utils');
// const product = require('./joma_prod');

(async () => {
  try {
    const mdb = {
      host: "203.118.42.106",
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
    console.log('reading DB..........................')
    const r = await db.collection(mdb.coll).find().skip(10510).toArray();
    const l = await db.collection(mdb.trColl).find().toArray();
    //band { buckle, type, color, material, materials, }
    //bezel { type, material, materials, color, }
    //case { shape, crown, coating, material, materials, back, crystal, crystalCoating, }
    //dial { type, color, handStyle, indexType, finish, }
    //gender
    //style
    const tr = {};
    l.forEach(t => {
      if (!tr[t.lang]) tr[t.lang] = {};
      const aName = t.attributeName.toLowerCase();
      if (!tr[t.lang][aName]) tr[t.lang][aName] = {};
      const aVal = t.attributeValue.toLowerCase();
      tr[t.lang][aName][aVal] = t.attributeTransValue;
    })
    // console.log(tr);
    // for (let i = 0; i < product.length; i++) {
    for (let i = 0; i < r.length; i++) {
      // const p = product[i];
      const p = r[i];
      console.log(r.length, i, 'id : ', p.id)
      const keys = Object.keys(tr);
      for (let i = 0; i < keys.length; i++) {
        let pl = {}
        const key = keys[i];
        const pLocal = await db.collection('product_local_2021').find({ id: p.id, lang: key }).toArray();
        const filter = pLocal && pLocal.length > 0 && pLocal[0].handledFields ? pLocal[0].handledFields : [];
        if (p.band && p.band.color && filter.indexOf('band.color') < 0) {
          const val = p.band.color.toLowerCase();
          if (tr[key]['color'] && tr[key]['color'][val]) {
            if (!pl.band) pl.band = {};
            pl.band.color = tr[key]['color'][val];
          }
        }
        if (p.band && p.band.type && filter.indexOf('band.type') < 0) {
          const val = p.band.type.toLowerCase();
          if (tr[key]['band.type'] && tr[key]['band.type'][val]) {
            if (!pl.band) pl.band = {};
            pl.band.type = tr[key]['band.type'][val];
          }
        }
        if (p.band && p.band.buckle && filter.indexOf('band.buckle') < 0) {
          const val = p.band.buckle.toLowerCase();
          if (tr[key]['band.buckle'] && tr[key]['band.buckle'][val]) {
            if (!pl.band) pl.band = {};
            pl.band.buckle = tr[key]['band.buckle'][val];
          }
        }
        if (p.band && p.band.material && filter.indexOf('band.material') < 0) {
          const val = p.band.material.toLowerCase();
          if (tr[key]['material'] && tr[key]['material'][val]) {
            if (!pl.band) pl.band = {};
            pl.band.material = tr[key]['material'][val];
          }
        }
        if (p.band && p.band.materials && filter.indexOf('band.materials') < 0) {
          if (tr[key]['material']) {
            if (!pl.band) pl.band = {};
            p.band.materials.forEach(m => {
              if (m && tr[key]['material'][m.toLowerCase()]) {
                if (!pl.band.materials) pl.band.materials = [];
                pl.band.materials.push(tr[key]['material'][m.toLowerCase()]);
              }
            })
          }
        }
        if (p.bezel && p.bezel.type && filter.indexOf('bezel.type') < 0) {
          const val = p.bezel.type.toLowerCase();
          if (tr[key]['bezel.type'] && tr[key]['bezel.type'][val]) {
            if (!pl.bezel) pl.bezel = {};
            pl.bezel.type = tr[key]['bezel.type'][val];
          }
        }
        if (p.bezel && p.bezel.color && filter.indexOf('bezel.color') < 0) {
          const val = p.bezel.color.toLowerCase();
          if (tr[key]['color'] && tr[key]['color'][val]) {
            if (!pl.bezel) pl.bezel = {};
            pl.bezel.color = tr[key]['color'][val];
          }
        }
        if (p.bezel && p.bezel.material && filter.indexOf('bezel.material') < 0) {
          console.log(p.id, '...bezel.material...', p.bezel.material)
          const val = p.bezel.material.toLowerCase();
          if (tr[key]['material'] && tr[key]['material'][val]) {
            if (!pl.bezel) pl.bezel = {};
            pl.bezel.material = tr[key]['material'][val];
          }
        }
        if (p.bezel && p.bezel.materials && filter.indexOf('bezel.materials') < 0) {
          if (tr[key]['material']) {
            if (!pl.bezel) pl.bezel = {};
            p.bezel.materials.forEach(m => {
              if (m && tr[key]['material'][m.toLowerCase()]) {
                if (!pl.bezel.materials) pl.bezel.materials = [];
                pl.bezel.materials.push(tr[key]['material'][m.toLowerCase()]);
              }
            })
          }
        }
        if (p.case && p.case.shape && filter.indexOf('case.shape') < 0) {
          const val = p.case.shape.toLowerCase();
          if (tr[key]['case.shape'] && tr[key]['case.shape'][val]) {
            if (!pl.case) pl.case = {};
            pl.case.shape = tr[key]['case.shape'][val];
          }
        }
        if (p.case && p.case.crown && filter.indexOf('case.crown') < 0) {
          const val = p.case.crown.toLowerCase();
          if (tr[key]['case.crown'] && tr[key]['case.crown'][val]) {
            if (!pl.case) pl.case = {};
            pl.case.crown = tr[key]['case.crown'][val];
          }
        }
        if (p.case && p.case.coating && filter.indexOf('case.coating') < 0) {
          const val = p.case.coating.toLowerCase();
          if (tr[key]['case.coating'] && tr[key]['case.coating'][val]) {
            if (!pl.case) pl.case = {};
            pl.case.coating = tr[key]['case.coating'][val];
          }
        }
        if (p.case && p.case.material && filter.indexOf('case.material') < 0) {
          const val = p.case.material.toLowerCase();
          if (tr[key]['material'] && tr[key]['material'][val]) {
            if (!pl.case) pl.case = {};
            pl.case.material = tr[key]['material'][val];
          }
        }
        if (p.case && p.case.materials && filter.indexOf('case.materials') < 0) {
          if (tr[key]['material']) {
            if (!pl.case) pl.case = {};
            p.case.materials.forEach(m => {
              if (m && tr[key]['material'][m.toLowerCase()]) {
                if (!pl.case.materials) pl.case.materials = [];
                pl.case.materials.push(tr[key]['material'][m.toLowerCase()]);
              }
            })
          }
        }
        if (p.case && p.case.back && filter.indexOf('case.back') < 0) {
          const val = p.case.back.toLowerCase();
          if (tr[key]['case.back'] && tr[key]['case.back'][val]) {
            if (!pl.case) pl.case = {};
            pl.case.back = tr[key]['case.back'][val];
          }
        }
        if (p.case && p.case.crystal && filter.indexOf('case.crystal') < 0) {
          const val = p.case.crystal.toLowerCase();
          if (tr[key]['case.crystal'] && tr[key]['case.crystal'][val]) {
            if (!pl.case) pl.case = {};
            pl.case.crystal = tr[key]['case.crystal'][val];
          }
        }
        if (p.case && p.case.crystalCoating && filter.indexOf('case.crystalCoating') < 0) {
          const val = p.case.crystalCoating.toLowerCase();
          if (tr[key]['case.crystalCoating'] && tr[key]['case.crystalCoating'][val]) {
            if (!pl.case) pl.case = {};
            pl.case.crystalCoating = tr[key]['case.crystalCoating'][val];
          }
        }
        if (p.dial && p.dial.color && filter.indexOf('dial.color') < 0) {
          const val = p.dial.color.toLowerCase();
          if (tr[key]['color'] && tr[key]['color'][val]) {
            if (!pl.dial) pl.dial = {};
            pl.dial.color = tr[key]['color'][val];
          }
        }
        if (p.dial && p.dial.type && filter.indexOf('dial.type') < 0) {
          const val = p.dial.type.toLowerCase();
          if (tr[key]['dial.type'] && tr[key]['dial.type'][val]) {
            if (!pl.dial) pl.dial = {};
            pl.dial.type = tr[key]['dial.type'][val];
          }
        }
        if (p.dial && p.dial.handStyle && filter.indexOf('dial.handStyle') < 0) {
          const val = p.dial.handStyle.toLowerCase();
          if (tr[key]['dial.handStyle'] && tr[key]['dial.handStyle'][val]) {
            if (!pl.dial) pl.dial = {};
            pl.dial.handStyle = tr[key]['dial.handStyle'][val];
          }
        }
        if (p.dial && p.dial.indexType && filter.indexOf('dial.indexType') < 0) {
          const val = p.dial.indexType.toLowerCase();
          if (tr[key]['dial.indexType'] && tr[key]['dial.indexType'][val]) {
            if (!pl.dial) pl.dial = {};
            pl.dial.indexType = tr[key]['dial.indexType'][val];
          }
        }
        if (p.dial && p.dial.finish && filter.indexOf('dial.finish') < 0) {
          const val = p.dial.finish.toLowerCase();
          if (tr[key]['dial.finish'] && tr[key]['dial.finish'][val]) {
            if (!pl.dial) pl.dial = {};
            pl.dial.finish = tr[key]['dial.finish'][val];
          }
        }
        if (p.gender && filter.indexOf('gender') < 0) {
          if (tr[key]['gender'] && tr[key]['gender'][p.gender])
            pl.gender = tr[key]['gender'][p.gender];
        }
        if (p.style && filter.indexOf('style') < 0) {
          if (tr[key]['style'] && tr[key]['style'][p.style])
            pl.style = tr[key]['style'][p.style];
        }
        pl.parentID = p.id;
        pl.name = p.name;
        pl.description = p.description;
        pl.lang = key;
        const { parentID, lang, ...other } = pl;
        await db.collection('product_local_2021').findOneAndUpdate(
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
