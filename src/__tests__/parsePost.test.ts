/**
 * @jest-environment jsdom
 */
import example from '../mock/example';
import {
  HeadingNode,
  HrNode,
  ImageNode,
  newHeading,
  newImage,
  newParagraph,
  NodeType,
  ParagraphNode,
  parseBody,
  parseFeed,
  parseItemElement,
  Post,
  PostBody,
  Substack,
  surgicallyDecodeHTMLEntities,
} from '../parser';

describe('surgicallyDecodeHTMLEntities', () => {
  it('replaces &amp; style entities', () => {
    const str = surgicallyDecodeHTMLEntities('hello &amp; world');
    expect(str).toBe('hello & world');
  });

  it('preserves HTML tags like <strong>...</strong>', () => {
    const str = surgicallyDecodeHTMLEntities('<em>hello &amp;</em> world');
    expect(str).toBe('<em>hello &</em> world');
  });
});

describe('Builder fns', () => {
  describe('newParagraph', () => {
    const innerValue = '<strong>Hello</strong> world';
    let el: Element;

    beforeAll(() => {
      el = document.createElement('p');
      el.innerHTML = innerValue;
    });

    it('returns a valid ParagraphNode', () => {
      const node = newParagraph(el);
      expect(node?.type).toBe(NodeType.PARAGRAPH);
    });

    it('passes innerHTML to Node', () => {
      const node = newParagraph(el);
      expect(node?.contents).toBe(innerValue);
    });

    it('parses HTML entities in content string', () => {
      const stringWithEntities = 'Hello &amp; world';
      const entitiesEl = document.createElement('p');
      entitiesEl.innerHTML = stringWithEntities;
      const node = newParagraph(entitiesEl);
      expect(node?.contents).toBe('Hello & world');
    });

    it('returns undefined when passed an empty <p></p>', () => {
      const node = newParagraph(document.createElement('p'));
      expect(node).toBeUndefined();
    });
  });

  describe('newImage', () => {
    const src =
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png';
    const caption = 'Hello world';
    let node: ImageNode | undefined;
    let el: Element;

    beforeAll(() => {
      el = document.createElement('div');
      el.innerHTML = `
        <figure>
          <a class="image-link is-viewable-img image2" target="_blank" href="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png">
            <div class="image2-inset">
              <picture>
                <source type="image/webp" srcset="https://substackcdn.com/image/fetch/w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png 424w, https://substackcdn.com/image/fetch/w_848,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png 848w, https://substackcdn.com/image/fetch/w_1272,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png 1272w, https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png 1456w" sizes="100vw">
                <img src="https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png" width="728" height="519.5" class="sizing-normal" alt="" srcset="https://substackcdn.com/image/fetch/w_424,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png 424w, https://substackcdn.com/image/fetch/w_848,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png 848w, https://substackcdn.com/image/fetch/w_1272,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png 1272w, https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F245c326f-2fc8-421b-8961-5f265c9d80e5_2160x1542.png 1456w" sizes="100vw">
              </picture>
              <div class="image-link-expand"></div>
            </div>
          </a>
          <figcaption class="image-caption">Hello world</figcaption>
        </figure>
      `;
      node = newImage(el);
    });

    it('returns a valid ImageNode', () => {
      expect(node?.type).toBe(NodeType.IMAGE);
      expect(node).toHaveProperty('src');
      expect(node).toHaveProperty('caption');
    });

    it('passes src and caption from HTML to Node', () => {
      expect(node?.src).toBe(src);
      expect(node?.caption).toBe(caption);
    });

    it('returns undefined when img element is not found', () => {
      const wrongEl = document.createElement('div');
      wrongEl.innerHTML =
        '<figure><figcaption>Hello world</figcaption></figure>';
      const wrongNode = newImage(wrongEl);
      expect(wrongNode).toBeUndefined();
    });
  });

  describe('newHeading', () => {
    it('returns a valid HeadingNode', () => {
      const h1 = document.createElement('h1');
      h1.innerHTML = 'hello world';
      const node = newHeading(h1);
      expect(node).toBeTruthy();
      expect(node?.type).toBe(NodeType.HEADING);
      expect(node).toHaveProperty('level');
      expect(node).toHaveProperty('contents');
    });

    it('passes content to Node', () => {
      const contents = 'hello world';
      const h1 = document.createElement('h1');
      h1.innerHTML = contents;
      const node = newHeading(h1);
      expect(node?.contents).toBe(contents);
    });


    it('parses HTML entities in content string', () => {
      const stringWithEntities = 'Hello &amp; world';
      const entitiesEl = document.createElement('h1');
      entitiesEl.innerHTML = stringWithEntities;
      const node = newHeading(entitiesEl);
      expect(node?.contents).toBe('Hello & world');
    });

    it('returns undefined if passed empty heading', () => {
      const h1 = document.createElement('h1');
      const node = newHeading(h1);
      expect(node).toBeUndefined();
    });

    it('passes the heading level to the Node', () => {
      const h1 = document.createElement('h1');
      h1.innerHTML = 'hello world';
      const h2 = document.createElement('h2');
      h2.innerHTML = 'hello world 2';
      const node1 = newHeading(h1);
      const node2 = newHeading(h2);
      expect(node1?.level).toBe(1);
      expect(node2?.level).toBe(2);
    });
  });
});

describe('parseFeed', () => {
  let feed: Substack;
  beforeAll(() => {
    feed = parseFeed(example(), 'nosaj');
  });

  it('parses the about string', () => {
    expect(feed.about).toBe(
      'A newsletter about the art of building valuable products and startups. For founders, engineers, and curious minds.',
    );
  });

  it('parses the publication image', () => {
    expect(feed.image).toBe(
      'https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fnosaj.substack.com%2Fimg%2Fsubstack.png',
    );
  });

  it('parses the subdomain', () => {
    expect(feed.subdomain).toBe('nosaj');
  });

  it('parses the title', () => {
    expect(feed.title).toBe('Foundations');
  });

  it('parses the URL', () => {
    expect(feed.url).toBe('https://nosaj.substack.com');
  });

  it('parses all posts', () => {
    expect(feed.posts).toHaveLength(5);
  });
});

describe('parseItemElement', () => {
  let post: Post;

  beforeAll(() => {
    const xml = example();
    const dom = new DOMParser().parseFromString(xml, 'text/xml');
    const items = dom.querySelectorAll('channel > item');
    post = parseItemElement(items[0]);
  });

  it('parses the slug (end of URL)', () => {
    expect(post.slug).toBe('why-twitter-deserves-to-live');
  });

  it('parses the author', () => {
    expect(post.author).toBe('Jason');
  });

  it('parses cover', () => {
    expect(post.cover).toBe('https://substackcdn.com/image/fetch/h_600,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F139556c2-f22d-4283-9372-87348c44d8d5_2000x800.jpeg');
  });

  it('parses description', () => {
    expect(post.description).toBe('What makes Twitter uniquely equipped to win.');
  });

  it('parses link', () => {
    expect(post.link).toBe('https://nosaj.substack.com/p/why-twitter-deserves-to-live');
  });

  it('parses publish date', () => {
    expect(post.pubdate).toBe('Fri, 11 Nov 2022 14:37:05 GMT');
  });

  it('parses publish title', () => {
    expect(post.title).toBe('Why Twitter Deserves to Live');
  });

  it('has the expected number of body nodes', () => {
    expect(post.body).toHaveLength(19);
  });
});

describe('parseBody', () => {
  let body: string;
  let parsedBody: PostBody;
  let parsedHTML: string;

  beforeAll(() => {
    body = `<div class="captioned-image-container"><figure><a class="image-link is-viewable-img image2" target="_blank" href="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png"><div class="image2-inset"><picture><source type="image/webp" srcset="https://substackcdn.com/image/fetch/w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png 424w, https://substackcdn.com/image/fetch/w_848,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png 848w, https://substackcdn.com/image/fetch/w_1272,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png 1272w, https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png 1456w" sizes="100vw"><img src="https://substackcdn.com/image/fetch/w_2400,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png" width="1200" height="856.3186813186813" data-attrs="{&quot;src&quot;:&quot;https://bucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com/public/images/f5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png&quot;,&quot;fullscreen&quot;:false,&quot;imageSize&quot;:&quot;large&quot;,&quot;height&quot;:1039,&quot;width&quot;:1456,&quot;resizeWidth&quot;:1200,&quot;bytes&quot;:836503,&quot;alt&quot;:null,&quot;title&quot;:null,&quot;type&quot;:&quot;image/png&quot;,&quot;href&quot;:null,&quot;belowTheFold&quot;:false,&quot;internalRedirect&quot;:null}" class="sizing-large" alt="" srcset="https://substackcdn.com/image/fetch/w_424,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png 424w, https://substackcdn.com/image/fetch/w_848,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png 848w, https://substackcdn.com/image/fetch/w_1272,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png 1272w, https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png 1456w" sizes="100vw"></picture><div class="image-link-expand"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg></div></div></a></figure></div><p>If you sail the seas of tech Twitter or LinkedIn you'll have likely noticed a trend lately: People can't seem to stop telling each other that consistency is the secret to whatever success is on the menu.</p><p>Despite this being an obvious idea, I still find myself feeling motivated by some of these posts. And it&#8217;s not news to me that doing something every day will result in progress. So what about it is motivating?</p><p>My best guess is that there's comfort in the simplicity of what consistency represents. It makes something potentially difficult and rife with unknowns into a prescriptive and manageable process. Just do the thing every day. Make the sacrifice and rewards will come.</p><p>Problem is, it doesn't matter how many times you read "consistency will get you everything", it won't make you more consistent. What makes you more consistent is two things: <strong>Conviction</strong> and <strong>discipline</strong>.</p><h2>&#127775; Conviction</h2><p>Conviction is just a strong &#8211; bordering on delusional &#8211; belief that something is worth the sacrifices necessary to make it happen. A good example is building a company.</p><p>Over the last few months I've been exploring the idea of building a company myself. Actually exploring a lot of different ideas hoping to find one that I can't not pursue. </p><p>I've worked with early stage startups and founders for years to get product companies off the ground, so I thought I was prepared for all the difficulties of starting one. But I never knew what the period was like pre-conviction. It takes serious energy to find what matters.</p><p>Conviction is the source of energy that drives the engine of consistency. Without deep belief that something is worth spending time on, it will be an uphill battle to do it with any form of consistency.</p><p>If you want to be consistent with something, discover what gives you strong conviction about it.</p><h2>&#128293; Discipline</h2><p>Discipline is the brute brother of conviction. While conviction wants to influence a behaviour, discipline forces it.</p><p>Conviction and discipline are both needed for consistency because humans are imperfect creatures. We might feel conviction to build a thing, but then sleep in late and miss an opportunity to get work done.</p><p>A personal anecdote comes to mind about cold showers. After learning about the positive effects for the mind and body from 11+ minutes of cold exposure each week, I developed a strong conviction for it. That means I have to take a cold shower for at least 1.5 minutes per day, and it's not something I want to do ever. I must rely on the brutal hand of discipline to force the behaviour.</p><p>The easiest way to use discipline is to force yourself to start something. Starting is always the hardest part. Once you've started, stopping will get harder and harder as you invest more effort.</p><div><hr></div><p>Consistency is easy when you have conviction and are willing to force yourself to make a sacrifice. Then consistency will get you everything.</p><p><em>Thanks as always for reading &#8211; I appreciate all of you &lt;3</em></p><div class="subscription-widget-wrap" data-attrs="{&quot;url&quot;:&quot;https://nosaj.substack.com/subscribe?&quot;,&quot;text&quot;:&quot;Subscribe&quot;}"><div class="subscription-widget show-subscribe"><div class="preamble"><p class="cta-caption">Subscribe for free to receive new posts and support my work.</p></div><form class="subscription-widget-subscribe"><input type="email" class="email-input" name="email" placeholder="Type your email&#8230;" tabindex="-1"><input type="submit" class="button primary" value="Subscribe"><div class="fake-input-wrapper"><div class="fake-input"></div><div class="fake-button"></div></div></form></div></div>`;
    const {nodes, html} = parseBody(body);
    parsedBody = nodes;
    parsedHTML = html;
  });

  it('parses paragraphs correctly', () => {
    expect(parsedBody[1].type).toBe(NodeType.PARAGRAPH);
    expect((parsedBody[1] as ParagraphNode)?.contents).toBe(
      "If you sail the seas of tech Twitter or LinkedIn you'll have likely noticed a trend lately: People can't seem to stop telling each other that consistency is the secret to whatever success is on the menu.",
    );
  });

  it('parses images correctly', () => {
    const node = parsedBody[0] as ImageNode;
    expect(node.type).toBe(NodeType.IMAGE);
    expect(node.src).toBe(
      'https://substackcdn.com/image/fetch/w_2400,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5d8f838-7bf3-43ba-bc50-d3e25a14a97b_2160x1542.png',
    );
    expect(node?.caption).toBeUndefined();
  });

  it('parses headings correctly', () => {
    const node = parsedBody[5] as HeadingNode;
    expect(node.type).toBe(NodeType.HEADING);
    expect(node.level).toBe(2);
    expect(node.contents).toBe('🌟 Conviction');
  });

  it('parses horizontal rules correctly', () => {
    const node = parsedBody[16] as HrNode;
    expect(node.type).toBe(NodeType.HR);
  });

  it('contains all expected elements, and ignores subscribe blocks', () => {
    expect(parsedBody.length).toBe(19);
  });

  it('generates bodyHTML string', () => {
    expect(typeof parsedHTML).toBe('string');
    expect(parsedHTML.includes('<p>')).toBeTruthy();
    expect(parsedHTML.includes('<h2>')).toBeTruthy();
  });
});
