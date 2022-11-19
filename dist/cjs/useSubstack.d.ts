import type { Substack } from './parser';
type UseSubstackValue = Partial<Substack> & {
    state: UseSubstackStates;
    error?: string;
};
type UseSubstackStates = 'loading' | 'ready' | 'data';
/**
 * Returns any substack newsletter as JSON
 */
export declare const useSubstack: (subdomain: string) => UseSubstackValue;
export {};
