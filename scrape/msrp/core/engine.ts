import {Scraper} from "./scraper";

export class ScrapeEngine {
    private static strategies = new Map();
    private static params = new Map();
    private static extractors = new Map();

    static registerParam(key, param) {
        this.params.set(key, param);
    }

    static registerExtractor(key, extractor) {
        this.extractors.set(key, extractor);
    }

    static registerStrategy(key, target) {
        const extractor = this.extractors.get(target);
        const params = this.params.get(target);
        const strategy = new Scraper(params, extractor);
        this.strategies.set(key, strategy);
    }

    static getStrategy(key): Scraper {
        return this.strategies.get(key);
    }
}