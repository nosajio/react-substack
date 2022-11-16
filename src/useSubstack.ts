import { useEffect, useState } from 'react';
import type { Substack } from './parser';
import { getAndParseSubstack } from './utils';

type UseSubstackValue = Partial<Substack> & {
  state: UseSubstackStates;
  error?: string;
};

type UseSubstackStates = 'loading' | 'ready' | 'data';

/**
 * Returns any substack newsletter as JSON
 */
export const useSubstack = (subdomain: string): UseSubstackValue => {
  const [substack, setSubstack] = useState<Substack>();
  const [error, setError] = useState<string>();
  const [state, setState] = useState<UseSubstackStates>('ready');

  useEffect(() => {
    if (state === 'loading') return;
    if (subdomain === '') {
      setError('A valid substack subdomain is required');
      return;
    }
    const getSubstack = async () => {
      setState('loading');
      const result = await getAndParseSubstack(subdomain);
      setSubstack(result);
      setState('data');
    }
    getSubstack();
  }, [state, subdomain]);

  return {
    ...substack,
    state,
    error,
  };
};
