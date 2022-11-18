/**
 * @jest-environment jsdom
 */
import {
  ImageNode,
  newHeading,
  newImage,
  newParagraph,
  NodeType,
} from '../parser';

describe('Builders fns', () => {
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

    it('passes content from HTML to Node', () => {
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
