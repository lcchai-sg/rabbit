async function delay(n) {
    return new Promise(res => setTimeout(res, n))
}


async function processLine(s) {
    console.log('process BEGIN:', s)
    await delay(300);
    console.log('process END:', s)
}

async function* readFileLineByLine() {
    for (let i = 0; i < 6; i++) {
        console.log('read BEGIN', i)
        await delay(1000);
        let t = await 'line' + i;
        console.log('read END', i)
        yield t;

    }
}

function* readFileLineByLinePending() {
    for (let i = 0; i < 6; i++) {
        console.log('readPending BEGIN', i)
        let t = delay(500).then(() => {
            console.log('readPending END', i);
            return 'line' + i;
        });
        yield t;

    }
}


async function main() {

    console.time('async gen')

    for await (let line of readFileLineByLine())
        await processLine(line)

    console.log('----------------------------------------')
    console.timeEnd('async gen')
    console.log('----------------------------------------')


    console.time('sync gen')

    let promises = [];

    for (let promise of readFileLineByLinePending())
        promises.push(promise.then(processLine))

    await Promise.all(promises)

    console.log('----------------------------------------')
    console.timeEnd('sync gen')
    console.log('----------------------------------------')
}

main().then(() => console.log('done'))