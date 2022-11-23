export enum NodeType {
  PARAGRAPH = 'paragraph',
  IMAGE = 'image',
  HR = 'hr',
  HEADING = 'heading',
  LIST = 'list',
  LI = 'listitem',
  BLOCKQUOTE = 'blockquote',
}

export type ParagraphNode = {
  type: NodeType.PARAGRAPH;
  children: string;
};

export type ImageNode = {
  type: NodeType.IMAGE;
  caption?: string;
  src: string;
};

export type ListNode = {
  type: NodeType.LIST;
  ordered: boolean;
  items: ListItemNode[];
};

export type ListItemNode = {
  type: NodeType.LI;
  children: BodyNode[];
};

export type BlockquoteNode = {
  type: NodeType.BLOCKQUOTE;
  children: BodyNode[];
};

export type HrNode = {
  type: NodeType.HR;
};

export type HeadingNode = {
  type: NodeType.HEADING;
  level: number;
  children: string;
};

export type BodyNode =
  | ParagraphNode
  | BlockquoteNode
  | ImageNode
  | HrNode
  | HeadingNode
  | ListNode
  | ListItemNode;

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
