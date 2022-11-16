import { BodyNode, HeadingNode, ImageNode, ParagraphNode, Post } from './types';
interface BuilderFn<T extends BodyNode> {
    (el: Element): T | undefined;
}
export declare const newParagraph: BuilderFn<ParagraphNode>;
export declare const newImage: BuilderFn<ImageNode>;
export declare const newHeading: BuilderFn<HeadingNode>;
export declare const parseCDATA: (...rawStr: string[]) => string[];
export declare const parseItemElement: (el: Element) => Post;
export {};
