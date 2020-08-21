import { generateBrandID } from "./mapper";

export * from "./mapper";

export const Mappers = {
    generateBrandID: new generateBrandID(),
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
