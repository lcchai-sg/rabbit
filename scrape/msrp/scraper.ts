#!/usr/bin/env node -r ts-node/register
import { from } from "rxjs";
import { Market } from "./core";
import { strategyLoader } from "./utils";
import { mergeMap } from "rxjs/operators";
import { ScrapeEngine } from "./core/engine";
import { mkt } from './market';

const getMSRP = async (strategy, market) => {

}
const sleep = async (interval, count) => {
    await new Promise(r => setTimeout(r, count * interval));
}

require("yargs")
    .command(
        ["exec", "run", "$0"],
        "Execute scrape",
        (yargs) => {
            return yargs
                .option("brand", {
                    alias: "b",
                    describe: "strategy for the brand, default all brands",
                    default: "",
                })
                .option("country", {
                    alias: "c",
                    describe: "market to scrape MSRP, default USA",
                    default: "usa",
                })
                .option("domain", {
                    alias: "t",
                    describe: "domain url to receive result",
                    default: "https://appraise.cosmos.ieplsg.com/v1/api",
                })
                .option("dry", {
                    alias: "d",
                    describe: "dry run"
                });
        },
        async (args) => {
            const { brand: strategy, country, dry, domain } = args;
            if (strategy) {
                if (country) {
                    console.log('MSRP scraping for ', strategy, ' market : ', country);
                } else {
                    const m = mkt[strategy.toLowerCase()];
                    if (m) {
                        from(m)
                            .subscribe(async (ctx) => {
                                console.log('MSRP scraping for ', strategy, ' market : ', ctx);
                            })
                    }
                }
            } else if (country) {
                const m = Object.keys(mkt);
                let cnt = 1;
                from(m)
                    .subscribe(async s => {
                        await sleep(5000, cnt);
                        // console.log('MSRP scraping for ', s, ' market : ', country, ' count : ', cnt++);
                        console.log(`ts-node src/scraper.ts ${s} ${country}`);
                    })
            }
            // let count = 1;
            // const path = "units/" + strategy;
            // await strategyLoader(path);
            // of({ strategy, market, })
            //     .pipe(
            //         mergeMap((ctx) => {
            //             const scraper = ScrapeEngine.getStrategy(ctx.strategy);
            //             return scraper.scrape(ctx);
            //         })
            //     )
            //     .subscribe(async (msrp) => {
            //         console.log(`#${count++} B:${msrp.payload.brandId} ${msrp.payload.reference} - MSRP: ${msrp.payload.amount}`)
            //         console.log(msrp.payload);
            //     });
        }
    )
    .argv;
