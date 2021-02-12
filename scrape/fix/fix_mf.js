const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');
const u = require('./fix_wm_urls');

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
        const job = {
            dryRun: false,
            payload: {
                strategy: "watchmaxx",
                command: "extraction",
                context: {
                    entry: u[i],
                    lang: "en",
                    source: "watchmaxx",
                }
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
        await new Promise(r => setTimeout(r, 5000))
    }
    process.exit(0)
})();
