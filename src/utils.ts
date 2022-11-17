import { parseFeed } from './parser';
import type { Substack } from './parser/types';

export const substackFeedUrl = (subdomain: string) =>
  `https://${subdomain}.substack.com/feed`;

/**
 * Get the raw XML feed for any substack
 */
export const getFeed = async (url: string) => {
  if (!url.startsWith('https://')) {
    throw new Error('invalid URL passed');
  }
  const res = await fetch(url, {
    mode: 'no-cors',
  });
  return await res.text();
};

export const getAndParseSubstack = async (
  subdomain: string,
): Promise<Substack> => {
  const url = substackFeedUrl(subdomain);
  const feed = await getFeed(url);
  const substack = parseFeed(feed, subdomain);
  return substack;
};
