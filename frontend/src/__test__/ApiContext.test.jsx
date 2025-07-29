import React, { useContext } from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ApiContext } from '../context/ApiContext';

const TestComponent = () => {
  const apiUrl = useContext(ApiContext);
  return <span>{apiUrl}</span>;
};

describe('ApiContext', () => {
  test('fournit la valeur du contexte', () => {
    render(
      <ApiContext.Provider value="http://localhost:4000">
        <TestComponent />
      </ApiContext.Provider>
    );

    expect(screen.getByText('http://localhost:4000')).toBeInTheDocument();
  });
});
