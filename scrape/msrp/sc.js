const { exec } = require('child_process')

const cmd = (command) => {
    const process = exec(command)
    let cont = true;
    do {
        process.stdout.on('data', (data) => {
            console.log(data.toString())
        })

        process.stderr.on('data', (data) => {
            console.log('stderr: ' + data.toString())
        })

        process.on('exit', (code) => {
            console.log('child process exited with code ' + code.toString());
            cont = false;
        })
    } while (cont);
}

const c = [
    'ts-node src/scraper.ts panerai usa',
    'ts-node src/scraper.ts armani fra',
    'ts-node src/scraper.ts breitling usa',
];

for (const cc of c) {
    console.log(cc);
    cmd(cc);
}