const { MongoClient } = require('mongodb');

(async () => {
    try {
        const mdb = {
            host: "203.118.42.106",
            port: 27017,
            user: "synopsis",
            pass: "synopsis",
            // host: "192.168.200.227",
            // port: 27017,
            // user: "productManager",
            // pass: "UInJRX7m",
            //
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
        const tdy = new Date();
        const numDays = 1000;
        const ytd = new Date(tdy - (numDays * 24 * 60 * 60 * 1000));
        // const ytd = new Date('2000-01-01');
        console.log('reading DB..............................');
        const r = await db.collection(mdb.coll).find({ provision: 1, }).toArray();
        // const r = await db.collection(mdb.coll).find({ provision: 1, lastUpdatedAt: { $gt: ytd } }).toArray();
        const l = await db.collection(mdb.trColl).find().toArray();
        //band { buckle, type, color, material, materials, }
        //bezel { type, material, materials, color, }
        //case { shape, crown, coating, material, materials, back, crystal, crystalCoating, }
        //dial { type, color, handStyle, indexType, finish, }
        //caliber { type }
        //gender
        //style
        const tr = {};
        l.forEach(t => {
            if (!tr[t.lang]) tr[t.lang] = {};
            const aName = t.attributeName;
            if (!tr[t.lang][aName]) tr[t.lang][aName] = {};
            const aVal = t.attributeValue.toLowerCase();
            tr[t.lang][aName][aVal] = t.attributeTransValue;
        })
        for (let i = 0; i < r.length; i++) {
            const p = r[i];
            console.log(r.length, i, '      id : ', p.id, '   reference : ', p.reference);
            const keys = Object.keys(tr);
            let translated = false;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const pLocal = await db.collection('product_local2').find({ parentID: p.id, lang: key }).toArray();
                const pl = pLocal && pLocal.length > 0 ? pLocal[0] : { parentID: p.id, lang: key, };
                const filter = pLocal && pLocal.length > 0 && pLocal[0].handledFields ? pLocal[0].handledFields : [];
                //band { color, type, buckle, material, materials, }
                if (p.band && p.band.color) {
                    if (tr[key]['band.color'] && filter.indexOf('band.color') < 0) {
                        const val = p.band.color.toLowerCase();
                        if (tr[key]['band.color'][val]) {
                            if (!pl.band) pl.band = {};
                            translated = true;
                            pl.band.color = tr[key]['band.color'][val];
                        }
                    }
                }
                if (p.band && p.band.type) {
                    if (tr[key]['band.type'] && filter.indexOf('band.type') < 0) {
                        const val = p.band.type.toLowerCase();
                        if (tr[key]['band.type'][val]) {
                            if (!pl.band) pl.band = {};
                            pl.band.type = tr[key]['band.type'][val];
                        }
                    }
                }
                if (p.band && p.band.buckle) {
                    if (tr[key]['band.buckle'] && filter.indexOf('band.buckle') < 0) {
                        const val = p.band.buckle.toLowerCase();
                        if (tr[key]['band.buckle'][val]) {
                            if (!pl.band) pl.band = {};
                            translated = true;
                            pl.band.buckle = tr[key]['band.buckle'][val];
                        }
                    }
                }
                if (p.band && p.band.material) {
                    if (tr[key]['material'] && filter.indexOf('band.material') < 0) {
                        const val = p.band.material.toLowerCase();
                        if (tr[key]['material'][val]) {
                            if (!pl.band) pl.band = {};
                            translated = true;
                            pl.band.material = tr[key]['material'][val];
                        }
                    }
                }
                if (p.band && p.band.materials) {
                    if (filter.indexOf('band.materials') < 0 && tr[key]['material']) {
                        p.band.materials.forEach(m => {
                            if (m && tr[key]['material'][m.toLowerCase()]) {
                                if (!pl.band) pl.band = {};
                                translated = true;
                                if (!pl.band.materials) pl.band.materials = [];
                                pl.band.materials.push(tr[key]['material'][m.toLowerCase()]);
                            }
                        })
                    }
                }
                //bezel { type, color, material, materials, }
                if (p.bezel && p.bezel.type) {
                    if (tr[key]['bezel.type'] && filter.indexOf('bezel.type') < 0) {
                        const val = p.bezel.type.toLowerCase();
                        if (tr[key]['bezel.type'][val]) {
                            if (!pl.bezel) pl.bezel = {};
                            translated = true;
                            pl.bezel.type = tr[key]['bezel.type'][val];
                        }
                    }
                }
                if (p.bezel && p.bezel.color) {
                    if (tr[key]['bezel.color'] && filter.indexOf('bezel.color') < 0) {
                        const val = p.bezel.color.toLowerCase();
                        if (tr[key]['bezel.color'][val]) {
                            if (!pl.bezel) pl.bezel = {};
                            translated = true;
                            pl.bezel.color = tr[key]['bezel.color'][val];
                        }
                    }
                }
                if (p.bezel && p.bezel.material) {
                    if (tr[key]['material'] && filter.indexOf('bezel.material') < 0) {
                        const val = p.bezel.material.toLowerCase();
                        if (tr[key]['material'][val]) {
                            if (!pl.bezel) pl.bezel = {};
                            translated = true;
                            pl.bezel.material = tr[key]['material'][val];
                        }
                    }
                }
                if (p.bezel && p.bezel.materials) {
                    if (filter.indexOf('bezel.materials') < 0 && tr[key]['material']) {
                        p.bezel.materials.forEach(m => {
                            if (m && tr[key]['material'][m.toLowerCase()]) {
                                if (!pl.bezel) pl.bezel = {};
                                translated = true;
                                if (!pl.bezel.materials) pl.bezel.materials = [];
                                pl.bezel.materials.push(tr[key]['material'][m.toLowerCase()]);
                            }
                        })
                    }
                }
                //case { shape, crown, coating, material, materials, back, crystal, crystalCoating, }
                if (p.case && p.case.shape) {
                    if (tr[key]['case.shape'] && filter.indexOf('case.shape') < 0) {
                        const val = p.case.shape.toLowerCase();
                        if (tr[key]['case.shape'][val]) {
                            if (!pl.case) pl.case = {};
                            translated = true;
                            pl.case.shape = tr[key]['case.shape'][val];
                        }
                    }
                }
                if (p.case && p.case.crown) {
                    if (tr[key]['case.crown'] && filter.indexOf('case.crown') < 0) {
                        const val = p.case.crown.toLowerCase();
                        if (tr[key]['case.crown'][val]) {
                            if (!pl.case) pl.case = {};
                            translated = true;
                            pl.case.crown = tr[key]['case.crown'][val];
                        }
                    }
                }
                if (p.case && p.case.coating) {
                    if (tr[key]['case.coating'] && filter.indexOf('case.coating') < 0) {
                        const val = p.case.coating.toLowerCase();
                        if (tr[key]['case.coating'][val]) {
                            if (!pl.case) pl.case = {};
                            translated = true;
                            pl.case.coating = tr[key]['case.coating'][val];
                        }
                    }
                }
                if (p.case && p.case.material) {
                    if (tr[key]['material'] && filter.indexOf('case.material') < 0) {
                        const val = p.case.material.toLowerCase();
                        if (tr[key]['material'][val]) {
                            if (!pl.case) pl.case = {};
                            translated = true;
                            pl.case.material = tr[key]['material'][val];
                        }
                    }
                }
                if (p.case && p.case.materials) {
                    if (filter.indexOf('case.materials') < 0 && tr[key]['material']) {
                        p.case.materials.forEach(m => {
                            if (m && tr[key]['material'][m.toLowerCase()]) {
                                if (!pl.case) pl.case = {};
                                translated = true;
                                if (!pl.case.materials) pl.case.materials = [];
                                pl.case.materials.push(tr[key]['material'][m.toLowerCase()]);
                            }
                        })
                    }
                }
                if (p.case && p.case.back) {
                    if (tr[key]['case.back'] && filter.indexOf('case.back') < 0) {
                        const val = p.case.back.toLowerCase();
                        if (tr[key]['case.back'][val]) {
                            if (!pl.case) pl.case = {};
                            translated = true;
                            pl.case.back = tr[key]['case.back'][val];
                        }
                    }
                }
                if (p.case && p.case.crystal) {
                    if (tr[key]['case.crystal'] && filter.indexOf('case.crystal') < 0) {
                        const val = p.case.crystal.toLowerCase();
                        if (tr[key]['case.crystal'][val]) {
                            if (!pl.case) pl.case = {};
                            translated = true;
                            pl.case.crystal = tr[key]['case.crystal'][val];
                        }
                    }
                }
                if (p.case && p.case.crystalCoating) {
                    if (tr[key]['case.crystalCoating'] && filter.indexOf('case.crystalCoating') < 0) {
                        const val = p.case.crystalCoating.toLowerCase();
                        if (tr[key]['case.crystalCoating'][val]) {
                            if (!pl.case) pl.case = {};
                            translated = true;
                            pl.case.crystalCoating = tr[key]['case.crystalCoating'][val];
                        }
                    }
                }
                //dial { color, type, handStyle, indexType, subIndexType, luminescense, finish, calendar }
                if (p.dial && p.dial.color) {
                    if (tr[key]['dial.color'] && filter.indexOf('dial.color') < 0) {
                        const val = p.dial.color.toLowerCase();
                        if (tr[key]['dial.color'][val]) {
                            if (!pl.dial) pl.dial = {};
                            translated = true;
                            pl.dial.color = tr[key]['dial.color'][val];
                        }
                    }
                }
                if (p.dial && p.dial.type) {
                    if (tr[key]['dial.type'] && filter.indexOf('dial.type') < 0) {
                        const val = p.dial.type.toLowerCase();
                        if (tr[key]['dial.type'][val]) {
                            if (!pl.dial) pl.dial = {};
                            translated = true;
                            pl.dial.type = tr[key]['dial.type'][val];
                        }
                    }
                }
                if (p.dial && p.dial.calendar) {
                    if (tr[key]['dial.calendar'] && filter.indexOf('dial.calendar') < 0) {
                        const val = p.dial.calendar.toLowerCase();
                        if (tr[key]['dial.calendar'][val]) {
                            if (!pl.dial) pl.dial = {};
                            translated = true;
                            pl.dial.calendar = tr[key]['dial.calendar'][val];
                        }
                    }
                }
                if (p.dial && p.dial.handStyle) {
                    if (tr[key]['dial.handStyle'] && filter.indexOf('dial.handStyle') < 0) {
                        const val = p.dial.handStyle.toLowerCase();
                        if (tr[key]['dial.handStyle'][val]) {
                            if (!pl.dial) pl.dial = {};
                            translated = true;
                            pl.dial.handStyle = tr[key]['dial.handStyle'][val];
                        }
                    }
                }
                if (p.dial && p.dial.indexType) {
                    if (tr[key]['dial.indexType'] && filter.indexOf('dial.indexType') < 0) {
                        const val = p.dial.indexType.toLowerCase();
                        if (tr[key]['dial.indexType'] && tr[key]['dial.indexType'][val]) {
                            if (!pl.dial) pl.dial = {};
                            translated = true;
                            pl.dial.indexType = tr[key]['dial.indexType'][val];
                        }
                    }
                }
                if (p.dial && p.dial.subIndexType) {
                    if (tr[key]['dial.subIndexType'] && filter.indexOf('dial.subIndexType') < 0) {
                        const val = p.dial.subIndexType.toLowerCase();
                        if (tr[key]['dial.subIndexType'] && tr[key]['dial.subIndexType'][val]) {
                            if (!pl.dial) pl.dial = {};
                            translated = true;
                            pl.dial.subIndexType = tr[key]['dial.subIndexType'][val];
                        }
                    }
                }
                if (p.dial && p.dial.luminescence) {
                    if (tr[key]['dial.luminescence'] && filter.indexOf('dial.luminescence') < 0) {
                        const val = p.dial.luminescence.toLowerCase();
                        if (tr[key]['dial.luminescence'] && tr[key]['dial.luminescence'][val]) {
                            if (!pl.dial) pl.dial = {};
                            translated = true;
                            pl.dial.luminescence = tr[key]['dial.luminescence'][val];
                        }
                    }
                }
                if (p.dial && p.dial.finish) {
                    if (tr[key]['dial.finish'] && filter.indexOf('dial.finish') < 0) {
                        const val = p.dial.finish.toLowerCase();
                        if (tr[key]['dial.finish'] && tr[key]['dial.finish'][val]) {
                            if (!pl.dial) pl.dial = {};
                            translated = true;
                            pl.dial.finish = tr[key]['dial.finish'][val];
                        }
                    }
                }
                //caliber { type, }
                if (p.caliber && p.caliber.type) {
                    if (tr[key]['caliber.type'] && filter.indexOf('caliber.type') < 0) {
                        const val = p.caliber.type.toLowerCase();
                        if (tr[key]['caliber.type'] && tr[key]['caliber.type'][val]) {
                            if (!pl.caliber) pl.caliber = {};
                            translated = true;
                            pl.caliber.type = tr[key]['caliber.type'][val];
                        }
                    }
                }
                if (p.gender && tr[key]['gender'] && filter.indexOf('gender') < 0 && tr[key]['gender'][p.gender]) {
                    translated = true;
                    pl.gender = tr[key]['gender'][p.gender];
                }
                if (p.style && filter.indexOf('style') < 0 && tr[key]['style'] && tr[key]['style'][p.style]) {
                    translated = true;
                    pl.style = tr[key]['style'][p.style];
                }
                if (p.features && filter.indexOf('features') < 0) {
                    p.features.forEach(f => {
                        if (typeof f === 'string') {
                            if (f && tr[key]['features'] && tr[key]['features'][f.toLowerCase()]) {
                                translated = true;
                                if (!pl.features) pl.features = [];
                                pl.features.push(tr[key]['features'][f.toLowerCase()]);
                            }
                        }
                    });
                }
                //if (filter.indexOf('name') < 0) pl.name = p.name;
                //if (filter.indexOf('description') < 0) pl.description = p.description;
                if (translated) {
                    const { parentID, lang, recordedAt, lastTransAt, ...other } = pl;
                    if (Object.keys(other).length > 0) {
                        await db.collection('product_local2').findOneAndUpdate(
                            { parentID, lang, },
                            {
                                $setOnInsert: { parentID, lang, recordedAt: new Date() },
                                $set: { ...other, },
                                $currentDate: { lastTransAt: { $type: 'date' } }
                            },
                            { upsert: true }
                        );
                    }
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
    process.exit(0);
})();
