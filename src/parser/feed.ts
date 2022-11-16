import { parseCDATA, parseItemElement } from './post';
import { Substack } from './types';

/**
 * Parse a feed XML string into a JSON data structure
 */
export const parseFeed = (feed: string, subdomain: string): Substack => {
  const dom = new DOMParser().parseFromString(feed, 'text/xml');
  const url = dom.querySelector('channel > link')?.innerHTML ?? '';
  const titleRaw = dom.querySelector('channel > title')?.innerHTML ?? '';
  const aboutRaw = dom.querySelector('channel > description')?.innerHTML ?? '';
  const image = dom.querySelector('channel > image > url')?.innerHTML ?? '';
  const items = Array.from(dom.querySelectorAll('channel > item'));
  const posts = items.map(parseItemElement);
  const [about, title] = parseCDATA(aboutRaw, titleRaw);

  return {
    about,
    title,
    image,
    posts,
    subdomain,
    url,
  };
};
