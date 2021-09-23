const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');
const u = require('./u_fix_urls');
const { Mappers } = require('../utils');
const cfg = require('../cfg');

(async function () {
    const mqHost = process.env.MESSAGE_HOST;
    const mqUser = process.env.MESSAGE_USER;
    const mqPass = process.env.MESSAGE_PASS;
    const mqVhost = process.env.MESSAGE_VHOST;
    const station = await MessageStation
        .connect({
            host: mqHost,
            user: mqUser,
            pass: mqPass,
            vhost: mqVhost
        });

    const channel = await station.createChannel();

    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i])

        let bname = '';
        if (u[i].match(/jomashop/i)) bname = 'jomashop';
        else if (u[i].match(/kechiq/i)) bname = 'kechiq';
        else if (u[i].match(/prestige/i)) bname = 'prestigetime';
        else if (u[i].match(/mayfair/i)) bname = 'watchesofmayfair';
        else if (u[i].match(/watchmaxx/i)) bname = 'watchmaxx';
        else {
            const { name } = Mappers.generateBrandID.map(u[i]);
            bname = name;
        }
        if (bname) {
            const k = Object.keys(cfg);
            let found = false; let strategy = '';
            for (let i = 0; i < k.length && !found; i++) {
                if (cfg[k[i]].brand === bname || cfg[k[i]].strategy === bname) {
                    found = true;
                    strategy = cfg[k[i]].strategy;
                }
            }

            if (!strategy) {
                console.log('NO STRATEGY : ', bname, u[i]);
                console.log('********************************************');
            } else {
                const job = {
                    dryRun: false,
                    payload: {
                        strategy,
                        command: "extraction",
                        context: { entry: u[i], }
                    }
                };

                try {
                    // extraction for product
                    await channel.publish(
                        'scraper',
                        'crawler',
                        Buffer.from(JSON.stringify(job)),
                        { replyTo: 'scrape.data.raw', correlationId: shortid.generate() });

                    console.log('submitted >', job);
                } catch (error) {
                    console.error('error : ', error)
                }
            }
        } else {
            console.log('******************** NO BRAND FOUND ********************');
            console.log(u[i]);
        }
        await new Promise(r => setTimeout(r, 3000))
    }
    process.exit(0)
})();
