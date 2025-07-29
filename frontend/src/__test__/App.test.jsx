import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApiContext } from '../context/ApiContext';
import App from '../App';

describe('App', () => {
  test('affiche le titre de la liste des tâches', () => {
    render(
      <ApiContext.Provider value="http://localhost:4000">
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ApiContext.Provider>
    );
    expect(screen.getByText(/Liste des tâches/i)).toBeInTheDocument();
  });

  test('affiche un message quand la liste est vide', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(
      <ApiContext.Provider value="http://localhost:4000">
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </ApiContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Aucune tâche/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('supprime une tâche lorsqu’on clique sur le bouton supprimer', async () => {
    // Premier fetch : la liste initiale avec une tâche
    vi.spyOn(global, 'fetch')
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ id: 1, title: 'Tâche 1' }]),
        })
      )
      // Deuxième fetch : la liste après suppression (vide)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      );

    render(
      <ApiContext.Provider value="http://localhost:4000">
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </ApiContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Tâche 1')).toBeInTheDocument();
    });

    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true });

    const deleteButton = screen.getByRole('button', { name: /supprimer/i });

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tasks/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    global.fetch.mockRestore();
  });
});
