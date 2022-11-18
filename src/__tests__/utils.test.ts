import example from '../mock/example';
import { getFeed, proxyUrl } from '../utils';

let url: string;
let feed: string;
const proxyBaseUrl = process.env.PROXY_URL;

// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(example()),
  }),
);

describe('substackFeedUrl', () => {
  it('returns a full RSS feed URL containing passed subdomain string', () => {
    url = proxyUrl('example');
    expect(url).toEqual(`${proxyBaseUrl}/example`);
  });
});

describe('getFeed', () => {
  it('takes the URL and returns a string ', async () => {
    feed = await getFeed(url);
    expect(typeof feed).toEqual('string');
    expect(feed.length).toBeGreaterThan(1);
  });
});
