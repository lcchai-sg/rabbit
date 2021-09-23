const { MessageStation } = require("@cosmos/utils");

(async function () {
    const station = await MessageStation
        .connect({
            host: 'mq.ieplsg.com',
            user: 'synopsis',
            pass: '2rbrwWwwEErLwRCMrJUZ',
            vhost: '/cs',
        });

    const client = await station.createClient({
        exchange: 'scraper',
        exType: 'topic',
        route: 'crawler',
        queue: 'scraper-crawler',
        timeout: 900000,
        handler: async message => {
            const { correlationId, replyTo } = message.properties;
            const { dryRun, payload } = JSON.parse(message.content);
            logger.debug(payload);
        }
    }, (channel) => {
        channel.prefetch = 2
    });
})();
