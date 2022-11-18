import type { Substack } from './parser/types';
export declare const proxyUrl: (subdomain: string) => string;
/**
 * Get the raw XML feed for any substack
 */
export declare const getFeed: (url: string) => Promise<string>;
export declare const getAndParseSubstack: (subdomain: string) => Promise<Substack>;
