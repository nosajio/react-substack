export enum NodeType {
  PARAGRAPH = 'paragraph',
  IMAGE = 'image',
  VIDEO = 'video',
  HR = 'hr',
  HEADING = 'heading',
}

export type ParagraphNode = {
  type: NodeType.PARAGRAPH;
  contents?: string;
};

export type ImageNode = {
  type: NodeType.IMAGE;
  caption?: string;
  src: string;
};

export type VideoNode = {
  type: NodeType.VIDEO;
  src: string;
};

export type HrNode = {
  type: NodeType.HR;
};

export type HeadingNode = {
  type: NodeType.HEADING;
  level: number;
  contents?: string;
};

export type BodyNode =
  | ParagraphNode
  | ImageNode
  // | VideoNode
  | HrNode
  | HeadingNode;

export type PostBody = BodyNode[];

export type Post = {
  pubdate: string;
  title: string;
  link: string;
  body: PostBody;
  bodyHTML: string;
  description?: string;
  cover?: string;
  author?: string;
  slug: string;
};

export type Substack = {
  url: string;
  subdomain: string;
  posts: Post[];
  about: string;
  title: string;
  image: string;
};
