(async () => {
    const e = 10;
    for (let i = 0; i < e; i++) {
        // process.stdout.write('\u001b[0E');
        // process.stdout.write('\u001b[2K\u001b[0E');
        process.stdout.write(`${i} / ${e}\r`);
        await new Promise(r => setTimeout(r, 5000));
    }
})();
