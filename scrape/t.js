const { of, Subject } = require("rxjs");
const { mergeMap } = require("rxjs/operators");

of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    .pipe(
        mergeMap(async (a) => {
            await new Promise(r => setTimeout(r, 5000));
            return a;
        })
    )
    .subscribe({
        next: async a => { console.log(a); await new Promise(r => setTimeout(r, 5000)) },
        complete: () => console.log('200 complete'),
    })
console.log('201 complete');