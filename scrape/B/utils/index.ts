import {
    generateBrandID,
    getBandType,
    getBezel,
    getBuckle,
    getCalendar,
    getCaliberType,
    getCaseBack,
    getCaseCrown,
    getCaseShape,
    getCoating,
    getColor,
    getCrystal,
    getCrystalCoating,
    getDialFinish,
    getDialType,
    getGender,
    getHandStyle,
    getIndexType,
    getLuminescence,
    getMaterial,
    getStyle,
    getWaterResistance,
    getDialColor,
} from "./mapper";

export * from "./mapper";

export const Mappers = {
    generateBrandID: new generateBrandID(),
    getBandType: new getBandType(),
    getBezel: new getBezel(),
    getBuckle: new getBuckle(),
    getCalendar: new getCalendar(),
    getCaliberType: new getCaliberType(),
    getCaseBack: new getCaseBack(),
    getCaseCrown: new getCaseCrown(),
    getCaseShape: new getCaseShape(),
    getCoating: new getCoating(),
    getColor: new getColor(),
    getCrystal: new getCrystal(),
    getCrystalCoating: new getCrystalCoating(),
    getDialFinish: new getDialFinish(),
    getDialType: new getDialType(),
    getGender: new getGender(),
    getHandStyle: new getHandStyle(),
    getIndexType: new getIndexType(),
    getLuminescence: new getLuminescence(),
    getMaterial: new getMaterial(),
    getStyle: new getStyle(),
    getWaterResistance: new getWaterResistance(),
    getDialColor: new getDialColor(),
};

export function clearEmpties(result) {
    for (const field in result) {
        if (!result[field] || typeof result[field] !== "object") {
            if (result[field] === [] || result[field] === "" || result[field] === null || result[field] === {}) {
                delete result[field];
            }
            continue;
        }
        if (Object.keys(result[field]).length === 0) {
            delete result[field];
        }
        for (const subField in result[field]) {
            if (!result[field][subField] || typeof result[field][subField] !== "object") {
                if (result[field][subField] === [] || result[field][subField] === "" || result[field][subField] === null || result[field][subField] === {}) {
                    delete result[field][subField];
                }
                continue;
            }
            if (Object.keys(result[field][subField]).length === 0) {
                delete result[field][subField];
            }
        }
    }
}
