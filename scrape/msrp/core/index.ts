import {ScrapeEngine} from "./engine";

export function Strategy(name: string): ClassDecorator {
    return function (target) {
        ScrapeEngine.registerStrategy(name, target);
        return target;
    }
}

export function Parameters(target, propertyKey: string, descriptor: PropertyDescriptor) {
    ScrapeEngine.registerParam(target.constructor, descriptor.value)
    return descriptor;
}

export function Extractor(target, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    ScrapeEngine.registerExtractor(target.constructor, descriptor.value)
    return descriptor;
}

export type UrlResolver = (params?) => string|string[]|Promise<string|string[]>;

export enum Market {
    USA = "USA",
    JPN = "JPN",
    HKG = "HKG",
    SGP = "SGP",
    CAN = "CAN",
    TWN = "TWN",
    DEU = "DEU",
    DNK = "DNK",
    GRC = "GRC",
    FRA = "FRA",
    ITA = "ITA",
    GBR = "GBR",
}

export type PriceMessage = {
    correlationId?: string,
    replyTo?: string,
    payload: PriceInfo
}

export type PriceInfo = {
    sourceId: number,
    type: string,
    market: string,
    brandId: number,
    reference: string,
    currencyId: number,
    price: number,
    tax: number,
    amount: number
}

export interface Params {
    step?: number,
    url: UrlResolver,
    pageSize: number,
    formatter: (any) => PriceInfo
}

export interface Context {
    interval?: number,
    correlationId?: string,
    replyTo?: string,
    strategy: string,
    market: Market
}

export type ParamsProvider = (market: Market) => Params;
export type ExtractStrategy = (options: any) => Promise<[any]>;


