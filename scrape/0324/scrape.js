#!/usr/local/bin/node
const { MessageStation } = require("@cosmos/utils");
const shortid = require('shortid');
const u = require('./urls');

(async function () {
    const station = await MessageStation
        .connect({
            host: 'mq.ieplsg.com',
            user: 'synopsis',
            pass: '2rbrwWwwEErLwRCMrJUZ',
            vhost: '/cs',
        });

    const channel = await station.createChannel();

    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i])
        const job = {
            dryRun: false,
            payload: {
                strategy: "meistersinger",
                command: "extraction",
                context: {
                    entry: u[i],
                    // lang: "en",
                    // source: "official",
                    // brand: "Nomos Glashuette",
                    // brandID: 134,
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
