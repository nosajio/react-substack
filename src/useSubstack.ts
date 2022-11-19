import { useEffect, useRef, useState } from 'react';
import type { Post, Substack } from './parser';
import { getAndParseSubstack } from './utils';

type UseSubstackValue = Partial<Substack> & {
  state: UseSubstackStates;
  error?: string;
};

type UseSubstackStates = 'loading' | 'ready' | 'data' | 'error';

/**
 * Returns any substack newsletter as JSON
 */
export const useSubstack = (subdomain: string): UseSubstackValue => {
  const requestLock = useRef<boolean>(false);
  const [substack, setSubstack] = useState<Substack>();
  const [error, setError] = useState<string>();
  const [state, setState] = useState<UseSubstackStates>('ready');

  useEffect(() => {
    if (state === 'loading' || requestLock.current) {
      return;
    }
    if (subdomain === '') {
      setError('A valid substack subdomain is required');
      return;
    }
    const getSubstack = async () => {
      requestLock.current = true;
      setState('loading');
      const result = await getAndParseSubstack(subdomain);
      setSubstack(result);
      setState('data');
    };
    getSubstack();
  }, [state, subdomain]);

  return {
    ...substack,
    state: error ? 'error' : state,
    error,
  };
};

type UsePostValue = {
  state: UseSubstackStates;
  error?: string;
  post?: Post;
};

/**
 * Returns a single post from a substack newsletter
 */
export const usePost = (subdomain: string, slug: string): UsePostValue => {
  const substack = useSubstack(subdomain);
  const [post, setPost] = useState<Post>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!Array.isArray(substack?.posts) || substack.posts.length === 0) {
      return;
    }
    const foundPost = substack.posts.find((p) => p.slug === slug);
    if (!foundPost) {
      setError('Post not found');
      return;
    }
    setPost(foundPost);
  }, [slug, substack.posts]);

  const errorState = error || substack.error;
  const state = errorState ? 'error' : post === undefined ? 'loading' : 'data';

  return {
    post,
    state,
    error: errorState,
  };
};
