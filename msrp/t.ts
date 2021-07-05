const { of, range } = require('rxjs');
const { mergeMap } = require("rxjs/operators");

const pause = async ctx => {
    await new Promise(r => setTimeout(r, 30000));
    return ({ ctx, dt: new Date() });
}

of(1,2,3,4,5,6,7,8,9,10,20,30)
    .pipe(ctx => { return pause(ctx) })
    .subscribe({
        next : async ctx => {
            await new Promise(r => setTimeout(r, 10000));
            console.log('subscription : ', ctx);
        },
        complete: () => {
            console.log('subscription done......................');
        }
    });