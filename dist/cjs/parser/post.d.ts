import { BlockquoteNode, BodyNode, HeadingNode, HrNode, ImageNode, ListItemNode, ListNode, ParagraphNode, Post, PostBody } from './types';
interface BuilderFn<T extends BodyNode> {
    (el: Element): T | undefined;
}
export declare const newParagraph: BuilderFn<ParagraphNode>;
export declare const newBlockquote: BuilderFn<BlockquoteNode>;
export declare const newList: BuilderFn<ListNode>;
export declare const newListItem: BuilderFn<ListItemNode>;
export declare const newImage: BuilderFn<ImageNode>;
export declare const newHeading: BuilderFn<HeadingNode>;
export declare const newHr: BuilderFn<HrNode>;
export declare const parseCDATA: (...rawStr: string[]) => string[];
export declare const parseBody: (rawBodyHTML: string) => {
    nodes: PostBody;
    html: string;
};
export declare const parseItemElement: (el: Element) => Post;
export {};
