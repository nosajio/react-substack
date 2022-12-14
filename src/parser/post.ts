import {
  BlockquoteNode,
  BodyNode,
  HeadingNode,
  HrNode,
  ImageNode,
  ListItemNode,
  ListNode,
  NodeType,
  ParagraphNode,
  Post,
  PostBody,
} from './types';

interface BuilderFn<T extends BodyNode> {
  (el: Element): T | undefined;
}

export const newParagraph: BuilderFn<ParagraphNode> = (el) => {
  const children = el.innerHTML;
  if (!children) return undefined;
  return {
    type: NodeType.PARAGRAPH,
    children,
  };
};

export const newBlockquote: BuilderFn<BlockquoteNode> = (el) => {
  if (el.children.length === 0) return undefined;
  const childEls = Array.from(el.children);
  const children = childEls.map(getChildNode).filter(Boolean) as BodyNode[];
  return {
    type: NodeType.BLOCKQUOTE,
    children,
  };
};

export const newList: BuilderFn<ListNode> = (el) => {
  const ordered = el.tagName === 'OL';
  const liEls = el.querySelectorAll('li');
  const childLis = Array.from(liEls).filter((em) => em.parentElement === el);
  const items = childLis.map(newListItem).filter(Boolean) as ListItemNode[];
  if (items.length === 0) return undefined;
  return {
    type: NodeType.LIST,
    ordered,
    items,
  };
};

export const newListItem: BuilderFn<ListItemNode> = (el) => {
  const childrenEls = el.children;
  const children = Array.from(childrenEls)
    .map(getChildNode)
    .filter(Boolean) as BodyNode[];
  return {
    type: NodeType.LI,
    children,
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
  const children = el.innerHTML;
  if (!children) return undefined;
  return {
    type: NodeType.HEADING,
    level,
    children,
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
          return `<p>${n.children}</p>`;
        case NodeType.BLOCKQUOTE:
          return `<blockquote>${recomposeHTML(n.children)}</blockquote>`;
        case NodeType.HEADING:
          return `<h${n.level}>${n.children}</h${n.level}>`;
        case NodeType.IMAGE:
          return `<figure class="post-image"><img src="${n.src}"/>${
            n.caption ? `<figcaption>${n.caption}</figcaption>` : ''
          }</figure>`;
        case NodeType.HR:
          return '<hr />';
        case NodeType.LIST: {
          const listType = n.ordered ? 'ol' : 'ul';
          return `<${listType}>${n.items
            .map((o) => `<li>${recomposeHTML(o.children)}</li>`)
            .join('\n')}</${listType}>`;
        }
        default:
          return '';
      }
    })
    .join('\n');

/**
 * Resolve BodyNodes from HTMLElements
 */
const getChildNode = (el: Element) => {
  switch (el.tagName) {
    case 'P':
      return newParagraph(el);
    case 'BLOCKQUOTE':
      return newBlockquote(el);
    case 'DIV': {
      if (el.classList.contains('captioned-image-container')) {
        return newImage(el);
      }
      if (el.children?.[0] && el.children[0].tagName === 'HR') {
        return newHr(el);
      }
      return undefined;
    }
    case 'LI': {
      return newListItem(el);
    }
    default: {
      if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
        return newHeading(el);
      }
      if (['UL', 'OL'].includes(el.tagName)) {
        return newList(el);
      }
      return undefined;
    }
  }
};

export const parseBody = (
  rawBodyHTML: string,
): { nodes: PostBody; html: string } => {
  const dom = new DOMParser().parseFromString(rawBodyHTML, 'text/html');
  const units = Array.from(dom.body.children);
  const bodyRaw = units.map(getChildNode);

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
