require('dotenv').config();
const { MessageStation } = require("@cosmos/utils");

(async () => {
    let args = process.argv.slice(2);
    if (!(args.length === 2)) {
        console.error("require 2 arguments");
        console.error("market, scraper");
        process.exit(1);
    }
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

    const msg = {
        payload: {
            // agent: null,
            // base: null,
            // type: null,
            // proxy: null,
            market: args[0],
            scraper: args[1],
        }
    };

    await channel.publish(
      'scraper-official-price', 
      'crawlerLC', 
      Buffer.from(JSON.stringify(msg)
      )
    );
    process.exit(0);
})();
