import {
  BodyNode,
  HeadingNode,
  HrNode,
  ImageNode,
  NodeType,
  ParagraphNode,
  Post,
  PostBody,
} from './types';

// Keep tempEl out of scope so that it can be reused. No need to create and
// destroy multiple elements to decode characters
let tempEl: HTMLDivElement;
const decodeEntity = (entity: string) => {
  if (!tempEl) {
    tempEl = document.createElement('div');
  }
  tempEl.innerHTML = entity;
  const decoded = tempEl.textContent;
  tempEl.innerHTML = ''; // reset element
  return decoded || entity;
};

/**
 * Replaces HTML entities with the decoded character. Should preserve all other
 * HTML in the string.
 */
export const surgicallyDecodeHTMLEntities = (html: string) => {
  const htmlCodePattern = /(&[#a-z0-9]*?;)/gi;
  return html.replace(htmlCodePattern, (substr) => decodeEntity(substr));
};

interface BuilderFn<T extends BodyNode> {
  (el: Element): T | undefined;
}

export const newParagraph: BuilderFn<ParagraphNode> = (el) => {
  const html = el.innerHTML;
  if (!html) return undefined;
  const contents = surgicallyDecodeHTMLEntities(html);
  return {
    type: NodeType.PARAGRAPH,
    contents,
  };
};

export const newImage: BuilderFn<ImageNode> = (el) => {
  const imgEl = el.querySelector('img');
  const src = imgEl?.getAttribute('src');
  if (!src) return undefined;
  const captionEl = el.querySelector('figcaption');
  const caption = captionEl ? captionEl.innerHTML : undefined;
  return {
    type: NodeType.IMAGE,
    src,
    caption,
  };
};

export const newHeading: BuilderFn<HeadingNode> = (el) => {
  const level = parseInt(el.nodeName[1]);
  const html = el.innerHTML;
  if (!html) return undefined;
  const contents = surgicallyDecodeHTMLEntities(html);
  return {
    type: NodeType.HEADING,
    level,
    contents,
  };
};

export const newHr: BuilderFn<HrNode> = () => {
  return {
    type: NodeType.HR,
  };
};

export const parseCDATA = (...rawStr: string[]) => {
  const exp = /!\[CDATA\[(.+)\]\]/s;
  return rawStr.map((s) => {
    const m = exp.exec(s);
    if (!m || m.length < 2) {
      // console.error('No CDATA on string %s', s);
      return '';
    }
    return m[1].trim();
  });
};

/**
 * Take a parsed node list and re-compose a HTML string. This is handy for
 * injecting a post's HTML directly with dangerouslySetHTML.
 */
const recomposeHTML = (nodes: PostBody): string =>
  nodes
    .map((n) => {
      switch (n.type) {
        case NodeType.PARAGRAPH:
          return `<p>${n.contents}</p>`;
        case NodeType.HEADING:
          return `<h${n.level}>${n.contents}</h${n.level}>`;
        case NodeType.IMAGE:
          return `<figure class="post-image"><img src="${n.src}"/>${
            n.caption ? `<figcaption>${n.caption}</figcaption>` : ''
          }</figure>`;
        case NodeType.HR:
          return '<hr />';
        default:
          return '';
      }
    })
    .join('\n');

export const parseBody = (
  rawBodyHTML: string,
): { nodes: PostBody; html: string } => {
  const dom = new DOMParser().parseFromString(rawBodyHTML, 'text/html');
  const units = Array.from(dom.body.children);

  const bodyRaw = units.map((el) => {
    switch (el.tagName) {
      case 'P':
        return newParagraph(el);
      case 'DIV': {
        if (el.classList.contains('captioned-image-container')) {
          return newImage(el);
        }
        if (el.children?.[0] && el.children[0].tagName === 'HR') {
          return newHr(el);
        }
        return undefined;
      }
      default: {
        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
          return newHeading(el);
        }
        return undefined;
      }
    }
  });

  // Remove all undefined elements from map
  const nodes = bodyRaw.filter(Boolean) as PostBody;

  // Recompose natural HTML
  const html = recomposeHTML(nodes);

  return {
    nodes,
    html,
  };
};

const getSlugFromUrl = (url: string) => {
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  const parts = url.split('/');
  return parts[parts.length - 1];
};

export const parseItemElement = (el: Element): Post => {
  const titleRaw = el.querySelector('title')?.innerHTML ?? '';
  const descriptionRaw = el.querySelector('description')?.innerHTML ?? '';
  const linkRaw = el.querySelector('link')?.innerHTML ?? '';
  const pubDateRaw = el.querySelector('pubDate')?.innerHTML ?? '';
  const cover = el.querySelector('enclosure')?.getAttribute('url') || undefined;
  const slug = getSlugFromUrl(linkRaw);

  // These coalescing selectors are necessary to make tests pass. For some reason
  // jsdom needs the namespace (string before the colon), while browsers don't
  // seem to care.
  const creatorRaw =
    el.querySelector('creator')?.innerHTML ??
    el.querySelector('dc\\:creator')?.innerHTML ??
    '';
  const contentRaw =
    el.querySelector('encoded')?.innerHTML ??
    el.querySelector('content\\:encoded')?.innerHTML ??
    '';

  const [title, description, author, content] = parseCDATA(
    titleRaw,
    descriptionRaw,
    creatorRaw,
    contentRaw,
  );

  const { nodes: body, html: bodyHTML } = parseBody(content);

  return {
    slug,
    title,
    description,
    author,
    pubdate: pubDateRaw,
    link: linkRaw,
    cover,
    bodyHTML,
    body,
  };
};
