import React from 'react';
import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';
import { ApiContext } from '../context/ApiContext';
import { MemoryRouter } from 'react-router-dom';

describe('main.jsx', () => {
  test('monte App sans erreur', () => {
    render(
      <ApiContext.Provider value="http://localhost:4000">
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ApiContext.Provider>
    );
    expect(true).toBe(true); // simple smoke test
  });
});
