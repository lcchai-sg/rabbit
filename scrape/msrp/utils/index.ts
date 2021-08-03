export function round(number: number, decimals: number = 0) {
    if (decimals === 0) {
        return Math.round(number);
    }
    if (decimals > 0) {
        return +(Math.round(+(number + "e" + decimals)) + "e-" + decimals);
    } else {
        decimals = -decimals;
        return +(Math.round(+(number + "e-" + decimals)) + "e" + decimals);
    }
}

export async function strategyLoader(path) {
    const cwd = process.cwd().split('/');
    const base = (cwd[cwd.length - 1] === 'src') ? `${process.cwd()}/${path}` : `${process.cwd()}/src/${path}`;
    await import(base);
}
