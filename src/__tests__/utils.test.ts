import { getFeed, substackFeedUrl } from '../utils';

let url: string;
let feed: string;

describe('substackFeedUrl', () => {
  it('returns a full RSS feed URL containing passed subdomain string', () => {
    url = substackFeedUrl('example');
    expect(url).toEqual('https://example.substack.com/feed');
  });
});

describe('getFeed', () => {
  it('takes the URL and returns a string ', async () => {
    feed = await getFeed(url);
    expect(typeof feed).toEqual('string');
    expect(feed.length).toBeGreaterThan(1);
  });

  it('throws when a invalid URL is passed', async () => {
    await expect(getFeed('')).rejects.toThrow();
  });
});
