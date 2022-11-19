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

interface BuilderFn<T extends BodyNode> {
  (el: Element): T | undefined;
}

export const newParagraph: BuilderFn<ParagraphNode> = (el) => {
  const contents = el.innerHTML;
  if (!contents) return undefined;
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
  const contents = el.innerHTML;
  if (!contents) return undefined;
  return {
    type: NodeType.HEADING,
    level,
    contents,
  };
};

export const newHr: BuilderFn<HrNode> = (el) => {
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

export const parseBody = (rawBodyHTML: string) => {
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
  const body = bodyRaw.filter(Boolean) as PostBody;
  return body;
};

export const parseItemElement = (el: Element): Post => {
  const titleRaw = el.querySelector('title')?.innerHTML ?? '';
  const descriptionRaw = el.querySelector('description')?.innerHTML ?? '';
  const linkRaw = el.querySelector('link')?.innerHTML ?? '';
  const pubDateRaw = el.querySelector('pubDate')?.innerHTML ?? '';
  const creatorRaw = el.querySelector('creator')?.innerHTML ?? '';
  const cover = el.querySelector('enclosure')?.getAttribute('url') || undefined;
  const contentRaw = el.querySelector('encoded')?.innerHTML ?? '';

  const [title, description, author, content] = parseCDATA(
    titleRaw,
    descriptionRaw,
    creatorRaw,
    contentRaw,
  );

  const body = parseBody(content);

  return {
    title,
    description,
    author,
    pubdate: pubDateRaw,
    link: linkRaw,
    cover,
    body,
  };
};
