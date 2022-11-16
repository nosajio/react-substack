/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import type { Substack } from '../parser';
import { useSubstack } from '../useSubstack';

describe('useSubstack', () => {
  it('returns an error when an empty subdomain is passed', () => {
    const { result } = renderHook(() => useSubstack(''));
    expect(result.current).toHaveProperty('error');
    expect(result.current.error).toBeTruthy();
  });

  it('has loading state before the data is ready', async () => {
    const Component = () => {
      const { state, ...substack } = useSubstack('nosaj');
      const [output, setOutput] = useState<string>('');
      useEffect(() => {
        if (state !== 'loading' || output !== '') return;
        setOutput(() =>
          state === 'loading' && !substack?.posts ? 'yes' : 'no',
        );
      }, [output, state, substack?.posts]);
      return output !== '' ? <div data-testid="result">{output}</div> : null;
    };

    render(<Component />);
    await waitFor(() => screen.getByTestId('result'));
    expect(screen.queryByTestId('result')).toHaveTextContent('yes');
  });

  it('returns the expected types when passed a valid subdomain', async () => {
    const expectedKeys: Array<keyof Substack> = [
      'about',
      'image',
      'posts',
      'subdomain',
      'title',
      'url',
    ];

    const Component = () => {
      const { state, ...substack } = useSubstack('nosaj');
      const [output, setOutput] = useState<string>('');
      useEffect(() => {
        if (state !== 'data') return;
        const keys = Object.keys(substack);
        const res = expectedKeys.every((k) => keys.includes(k));
        setOutput(() => (res ? 'yes' : 'no'));
      }, [state, substack]);
      return output !== '' ? <div data-testid="result">{output}</div> : null;
    };

    render(<Component />);
    await waitFor(() => screen.getByTestId('result'));
    expect(screen.queryByTestId('result')).toHaveTextContent('yes');
  });

  it('returns substack metadata fields', async () => {
    const Component = () => {
      const { state, ...substack } = useSubstack('nosaj');
      const [output, setOutput] = useState<string>('');
      useEffect(() => {
        if (state !== 'data') return;
        const res = substack?.about && substack?.title && substack?.image;
        setOutput(() => (res ? 'yes' : 'no'));
      }, [state, substack]);
      return output !== '' ? <div data-testid="result">{output}</div> : null;
    };

    render(<Component />);
    await waitFor(() => screen.getByTestId('result'));
    expect(screen.queryByTestId('result')).toHaveTextContent('yes');
  });

  it('returns an array of posts', async () => {
    const Component = () => {
      const { state, ...substack } = useSubstack('nosaj');
      const [output, setOutput] = useState<string>('');
      useEffect(() => {
        if (state !== 'data') return;
        const res = Array.isArray(substack?.posts) && substack.posts.length > 0;
        setOutput(() => (res ? 'yes' : 'no'));
      }, [state, substack]);
      return output !== '' ? <div data-testid="result">{output}</div> : null;
    };

    render(<Component />);
    await waitFor(() => screen.getByTestId('result'));
    expect(screen.queryByTestId('result')).toHaveTextContent('yes');
  });
});
