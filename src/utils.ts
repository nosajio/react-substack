import { parseFeed } from './parser';
import type { Substack } from './parser/types';

const proxyBaseUrl = 'https://feed.reactsubstack.com';

export const proxyUrl = (subdomain: string) => `${proxyBaseUrl}/${subdomain}`;

/**
 * Get the raw XML feed for any substack
 */
export const getFeed = async (url: string) => {
  const res = await fetch(url, {
    mode: 'cors',
  });
  return await res.text();
};

export const getAndParseSubstack = async (
  subdomain: string,
): Promise<Substack> => {
  const url = proxyUrl(subdomain);
  const feed = await getFeed(url);
  const substack = parseFeed(feed, subdomain);
  return substack;
};
