const { MessageStation } = require("@cosmos/utils");

(async function () {
    const station = await MessageStation
        .connect({
            host: "mq.ieplsg.com",
            user: "synopsis",
            pass: "2rbrwWwwEErLwRCMrJUZ",
            vhost: "/cs",
        });
    const client = await station.createClient({
        exchange: 'scraper',
        exType: 'topic',
        route: 'scrape.data.raw',
        queue: 'scraper-distiller',
        timeout: 900000,
        handler: async message => {
            const { correlationId, replyTo } = message.properties;
            const { dryRun, payload } = JSON.parse(message.content);
            console.log('correlationId : ', correlationId);
            console.log('replyTo : ', replyTo);
            console.log('payload : ', payload);
        }
    }, (channel) => {
        channel.prefetch = 2
    });
})();

// crawler
// route: 'crawler'
// queue: ' scraper-crawler'
// url-collector
// route: 'collector',
// queue: 'scraper-collector',
// origin
// route: 'origin',
// queue: 'scraper-origin',
// info-distiller
// route: 'scrape.data.raw',
// queue: 'scraper-distiller',
// info-collector
// route: 'scrape.data.raw',
// queue: 'scraper-info',
