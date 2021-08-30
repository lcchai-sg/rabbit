const { Mappers } = require('./utils');

const p = [
    {
        url: 'https://www.rado.com/en_us/collections/diastar-original/new-original/R12999153',
        spec: [
            { key: 'Movement', value: 'Automatic' },
            { key: 'Size', value: '38.5 mm' },
            { key: 'Total weight', value: '187 gram' },
            { key: 'Thickness:', value: '12.6 mm' },
            {
                key: 'Water resistance:',
                value: 'Water-resistant 10 bar (100 m)'
            },
            { key: 'Crown:', value: 'Screwed crown' },
            { key: 'Crystal:', value: 'Sapphire crystal' },
            { key: 'Case back:', value: 'Screw-down case back' },
            {
                key: 'Case Material:',
                value: 'PVD-coated hardmetal, Stainless steel, Stainless steel / PVD'
            },
            { key: 'Gender:', value: 'Gents' },
            { key: 'Shape:', value: 'Oval' },
            { key: 'Case color:', value: 'Coloured' },
            { key: 'Dial:', value: 'black' },
            { key: 'Date display:', value: 'Yes' },
            { key: 'Movement Power Reserve:', value: '80-hour' },
            { key: 'Bracelet:', value: 'Stainless steel / PVD, Titanium' },
            { key: 'Bracelet reference:', value: '07.02908' }
        ],
        related: [
            'R12408613',
            'R12408633',
            'R12413313',
            'R12413314',
            'R12413343',
            'R12413493'
        ],
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        name: 'New Original Automatic',
        description: 'The Rado New Original represents a classic Rado look and feel with the very latest in high performance materials. This is a Rado icon, reimagined for twenty-first century wearers.',
        reference: 'R12999153',
        gender: 'X',
        thumbnail: 'https://www.rado.com/sites/default/files/images/swp/diastar-original/r12999153_s.png',
        sku: '01.764.0999.3.015',
        retail: 'USD1700',
        strategy: 'rado'
    }
];

const distill = async (context) => {
    try {
        const { payload } = context;
        const { spec, ...rest } = payload;
        const result = {
            ...rest, additional: [], functions: [], features: [],
            case: {}, band: {}, dial: {}, caliber: {}, bezel: {},
        };
        for (const s of spec) {
            let pp = false;
            const key = s.key.toLowerCase().replace(/:/g, "").split('.').join('').trim();
            const value = s.value.trim();
            if (key === 'movement') {
                pp = true;
                const r = Mappers.getCaliberType.map(value);
                result.caliber.type = r ? r : value;
                result.movementType = result.caliber.type;
                result.caliber.brand = 'Rado';
                result.caliber.label = 'Swiss';
            }
            if (key === 'size') {
                pp = true;
                if (value.match(/ x /i)) result.case.size = value;
                else result.case.diameter = value;
            }
            if (key === 'total weight') {
                pp = true;
                result.weight = value;
            }
            if (key === 'thickness') {
                pp = true;
                result.case.thickness = value;
            }
            if (key === 'water resistance') {
                pp = true;
                result.case.waterResistance = value;
                result.waterResistance = Mappers.getWaterResistance.map(value);
            }
            if (key === 'crown') {
                pp = true;
                const r = Mappers.getCaseCrown.map(value);
                result.case.crown = r ? r : value;
            }
            if (key === 'crystal') {
                pp = true;
                const c = Mappers.getCrystal.map(value);
                const cc = Mappers.getCrystalCoating.map(value);
                result.case.crystal = c ? c : value;
                if (cc) result.case.crystalCoating = cc;
            }
            if (key === 'case back') {
                pp = true;
                const r = Mappers.getCaseBack.map(value);
                result.case.back = r ? r : value;
            }
            if (key === 'case material') {
                pp = true;
                const { bm, bms, } = Mappers.getMaterial.map(value);
                result.case.material = bm ? bm : value;
                result.case.materials = bm ? bms : [value];
            }
            if (key === 'gender') {
                pp = true;
                const r = Mappers.getGender.map(value);
                result.gender = r ? r : value;
            }
            if (key === 'shape') {
                pp = true;
                const r = Mappers.getCaseShape.map(value);
                result.case.shape = r ? r : value;
            }
            // if (key === 'case color:') {
            //     pp = true;
            //     result.band.color = value;
            // }
            if (key === 'dial') {
                pp = true;
                const r = Mappers.getColor.map(value);
                result.dial.color = r ? r : value;
                result.dialColor = Mappers.getDialColor.map(result.dial.color);
            }
            if (key === 'movement power reserve') {
                pp = true;
                const pr = value.match(/\d{1,3}[ -]?hours?/ig);
                if (pr) result.caliber.reserve = pr[0];
            }
            if (key === 'date display') {
                const r = Mappers.getCalendar.map(value);
                result.caliber.calendar = r ? r : value;
            }
            if (key === 'bracelet') {
                pp = true;
                const { bm, bms, bt, } = Mappers.getMaterial.map(value);
                if (bt) result.band.type = bt;
                result.band.material = bm ? bm : value;
                result.band.materials = bm ? bms : [value];
            }
            if (key === 'small second') {
                pp = true;
                if (value === 'Yes') result.features.push('Small seconds');
                else if (value !== 'No') result.features.push(value);
            }
            if (key === 'moonphase') {
                pp = true;
                if (value === 'Yes') result.features.push('Moonphase');
                else if (value !== 'No') result.features.push(value);
            }
            if (key === 'precious stones' || key === 'jewels') {
                pp = true;
                result.features.push(value);
            }
            if (key === 'chronograph') {
                pp = true;
                result.functions.push('Chronograph');
            }
            if (key === 'limited edition') {
                pp = true;
                result.limited = true;
            }
            if (!pp) result.additional.push({ [key]: value });
        }
        return result;
    } catch (error) {
        console.log('Failed distillation for Rado with error : ' + error);
        return {};
    }
};

(async () => {
    for (const pp of p) {
        const r = await distill({
            payload: pp,
        });
        console.log(r);
    }
})();
