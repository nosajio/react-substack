/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import React, { useEffect, useRef, useState } from 'react';
import example from '../mock/example';
import { usePost } from '../useSubstack';

// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(example()),
  }),
);

describe('usePost', () => {
  it('returns an error when the slug cannot be found', async () => {
    const Component = () => {
      const { state, error } = usePost('nosaj', 'this-doesnt-exist');
      const [success, setSuccess] = useState<boolean>(false);
      useEffect(() => {
        if (state !== 'error' || success) {
          return;
        }
        setSuccess(typeof error === 'string' && error.length > 1);
      }, [state, error]);
      return success ? <div data-testid="result">yes</div> : null;
    };

    await act(async () => {
      render(<Component />);
    });
    await waitFor(() => screen.getByTestId('result'));
    expect(screen.queryByTestId('result')).toHaveTextContent('yes');
  });

  it('returns the correct post from its slug', async () => {
    const Component = () => {
      const { state, post } = usePost('nosaj', 'effective');
      const [success, setSuccess] = useState<boolean>(false);
      useEffect(() => {
        if (state !== 'data' || success) {
          return;
        }
        setSuccess(post !== undefined && post.title === 'Effective leaders');
      }, [post, state]);
      return success ? <div data-testid="result">yes</div> : null;
    };

    await act(async () => {
      render(<Component />);
    });
    await waitFor(() => screen.getByTestId('result'));
    expect(screen.queryByTestId('result')).toHaveTextContent('yes');
  });

  // This helps avoid a race condition from the useSubstack hook's state
  // changing to 'data' before usePost has found the post with the passed slug
  it("doesn't change state to 'data' until post is found", async () => {
    const Component = () => {
      const { state, post } = usePost('nosaj', 'effective');
      const runRef = useRef(false);
      const [success, setSuccess] = useState<boolean>(false);
      useEffect(() => {
        if (state !== 'data' || runRef.current) {
          return;
        }
        runRef.current = true;
        setSuccess(post !== undefined);
      }, [post, state]);
      return success ? <div data-testid="result">yes</div> : null;
    };

    await act(async () => {
      render(<Component />);
    });
    await waitFor(() => screen.getByTestId('result'));
    expect(screen.queryByTestId('result')).toHaveTextContent('yes');
  });
});
