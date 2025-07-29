import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import TaskForm from './pages/TaskForm.jsx';
import './index.css';
import { ApiProvider } from './context/ApiContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApiProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/task/:id?" element={<TaskForm />} />
        </Routes>
      </BrowserRouter>
    </ApiProvider>
  </React.StrictMode>,
);
