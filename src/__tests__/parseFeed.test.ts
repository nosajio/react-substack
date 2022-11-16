/**
 * @jest-environment jsdom
 */
import feed from '../mock/example';
import { parseFeed, Substack } from '../parser';

const substackObject: Partial<Substack> = {
  about:
    'A newsletter about the art of building valuable products and startups. For founders, engineers, and curious minds.',
  image:
    'https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fnosaj.substack.com%2Fimg%2Fsubstack.png',
  title: 'Foundations',
  subdomain: 'nosaj',
  url: 'https://nosaj.substack.com',
};

describe('parseFeed', () => {
  let substack: Partial<Substack>;
  beforeAll(() => {
    substack = parseFeed(feed(), 'nosaj');
  });

  it('takes a feed string and returns a Post object', () => {
    expect(substack).toMatchObject<Partial<Substack>>(substackObject);
  });

  it('returns correct number of posts', () => {
    expect(substack?.posts).toHaveLength(5);
  });
});
