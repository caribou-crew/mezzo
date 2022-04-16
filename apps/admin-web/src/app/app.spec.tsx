import { cleanup, getAllByText, render, waitFor } from '@testing-library/react';
import React from 'react';
import App from './app';

describe('App', () => {
  afterEach(() => {
    delete global['fetch'];
    cleanup();
  });

  it('should render successfully', async () => {
    global['fetch'] = jest.fn().mockResolvedValueOnce({
      json: () => ({ routes: [{
            id: 'GET /route1',
            path: '/route1',
            handler: jest.fn(),
          }]}),
    });

    const { baseElement } = render(<App />);
    await waitFor(() => getAllByText(baseElement, 'Search...'));
  });
});
