db.getCollection('product').find({}).forEach(data => {
    if (data.nameLocal) {
        nameL = data.nameLocal[0].value;
    } else {
        nameL = null;
    }
    if (data.waterResistanceLocal) {
        wrL = data.waterResistanceLocal[0].value;
    } else {
        wrL = null;
    }
    if (data.caliberLocal) {
        obj = data.caliberLocal[0];
        delete obj["lang"];
        caliberL = obj;
    } else {
        wrL = null;
    }
    if (data.bandLocal) {
        obj = data.bandLocal[0];
        delete obj["lang"];
        bandL = obj;
    } else {
        bandL = null;
    }
    if (data.caseLocal) {
        obj = data.caseLocal[0];
        delete obj["lang"];
        caseL = obj;
    } else {
        caseL = null;
    }
    if (data.dialLocal) {
        obj = data.dialLocal[0];
        delete obj["lang"];
        dialL = obj;
    } else {
        dialL = null;
    }
    if (data.descriptionLocal) {
        dL = data.descriptionLocal[0].value;
    } else {
        dL = null;
    }
    p_local = {
        parentID: NumberInt(data.id),
        lang: "jp",
        name: nameL,
        description: dL,
        waterResistance: wrL,
        caliber: caliberL,
        band: bandL,
        case: caseL,
        dial: dialL,
        version: NumberInt(1),
        editor: NumberInt(-1),
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    db.product_local_01.insert(p_local);
})