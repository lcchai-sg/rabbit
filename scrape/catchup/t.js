const { of } = require('rxjs');

of(1, 2, 3, 4, 5, 6, 7, 8, 9)
    .subscribe({
        next: async d => {
            await new Promise(r => setTimeout(r, 10000));
            console.log(d);
        },
        complete: () => {
            console.log('completed...');
        }
    })

console.log('done................');
