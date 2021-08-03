import {
    Context,
    ExtractStrategy,
    ParamsProvider,
    PriceMessage,
} from "./index";
import { EMPTY, Observable, range } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import { delay, expand, mergeMap } from "rxjs/operators";

export class Scraper {
    constructor(
        private getParams: ParamsProvider,
        private extract: ExtractStrategy
    ) { }

    private extractor(options: any): Observable<any[]> {
        return fromPromise(this.extract(options));
    }

    scrape(context: Context): Observable<PriceMessage> {
        const { market, interval = 1000, correlationId, replyTo } = context;
        const { step = 1, url, pageSize, formatter } = this.getParams(market);
        return range(0, step).pipe(
            mergeMap((step) => {
                return this.extractor({ target: url({ step }), step, market }).pipe(
                    delay(interval),
                    expand((results, idx) => {
                        return results.length < pageSize
                            ? EMPTY
                            : this.extractor({
                                target: url({ p: idx + 2, step }),
                                step,
                                market,
                                page: idx + 2,
                            }).pipe(delay(interval));
                    }),
                    mergeMap((results) => {
                        return results.map((result) => {
                            return {
                                correlationId,
                                replyTo,
                                payload: formatter(result),
                            };
                        });
                    })
                );
            })
        );
    }
}
