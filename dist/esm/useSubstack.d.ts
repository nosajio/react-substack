import type { Post, Substack } from './parser';
type UseSubstackValue = Partial<Substack> & {
    state: UseSubstackStates;
    error?: string;
};
type UseSubstackStates = 'loading' | 'ready' | 'data' | 'error';
/**
 * Returns any substack newsletter as JSON
 */
export declare const useSubstack: (subdomain: string) => UseSubstackValue;
type UsePostValue = {
    state: UseSubstackStates;
    error?: string;
    post?: Post;
};
/**
 * Returns a single post from a substack newsletter
 */
export declare const usePost: (subdomain: string, slug: string) => UsePostValue;
export {};
