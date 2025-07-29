import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApiContext } from '../context/ApiContext';
import TaskForm from "../pages/TaskForm";

describe('TaskForm', () => {
  test('affiche le formulaire et permet la saisie', async () => {
    render(
      <ApiContext.Provider value="http://localhost:4000">
        <MemoryRouter>
          <TaskForm />
        </MemoryRouter>
      </ApiContext.Provider>
    );
    expect(screen.getByRole('heading', { name: /Ajouter/i })).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Titre/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Nouvelle tâche' } });
    expect(input).toHaveValue('Nouvelle tâche');
  });

  test('soumet le formulaire et appelle fetch', async () => {
    const mockFetch = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(
      <ApiContext.Provider value="http://localhost:4000">
        <MemoryRouter>
          <TaskForm />
        </MemoryRouter>
      </ApiContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Titre/i), {
      target: { value: 'Nouvelle tâche' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ajouter/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    mockFetch.mockRestore();
  });
});
