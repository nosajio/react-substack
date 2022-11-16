export declare enum NodeType {
    PARAGRAPH = "paragraph",
    IMAGE = "image",
    VIDEO = "video",
    HR = "hr",
    HEADING = "heading"
}
export declare type ParagraphNode = {
    type: NodeType.PARAGRAPH;
    contents?: string;
};
export declare type ImageNode = {
    type: NodeType.IMAGE;
    caption?: string;
    src: string;
};
export declare type VideoNode = {
    type: NodeType.VIDEO;
    src: string;
};
export declare type HrNode = {
    type: NodeType.HR;
};
export declare type HeadingNode = {
    type: NodeType.HEADING;
    level: number;
    contents?: string;
};
export declare type BodyNode = ParagraphNode | ImageNode | VideoNode | HrNode | HeadingNode;
export declare type PostBody = BodyNode[];
export declare type Post = {
    pubdate: string;
    title: string;
    link: string;
    body: PostBody;
    description?: string;
    cover?: string;
    author?: string;
};
export declare type Substack = {
    url: string;
    subdomain: string;
    posts: Post[];
    about: string;
    title: string;
    image: string;
};
