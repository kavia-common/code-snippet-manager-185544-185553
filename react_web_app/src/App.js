import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import SnippetForm from './components/SnippetForm';
import SnippetList from './components/SnippetList';
import Toast from './components/Toast';
import { createDataService } from './services/dataService';

// Types
/**
 * @typedef {Object} SnippetItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} code
 * @property {number} createdAt
 * @property {number} updatedAt
 */

// PUBLIC_INTERFACE
function App() {
  /** Theme handling (light by default to match style guide) */
  const [theme] = useState('light');

  /** Toast state */
  const [toast, setToast] = useState({ open: false, type: 'success', message: '' });

  /** Editing state */
  const [editingId, setEditingId] = useState(null);

  /** Items state */
  const [items, setItems] = useState(
    /** @type {SnippetItem[]} */ ([]),
  );

  /** Data service (localStorage by default, API-ready abstraction) */
  const dataService = useMemo(() => createDataService(), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load initial data
  useEffect(() => {
    let mounted = true;
    dataService
      .list()
      .then((list) => {
        if (mounted) setItems(list);
      })
      .catch(() => {
        openToast('error', 'Failed to load items. Using empty list.');
      });
    return () => {
      mounted = false;
    };
  }, [dataService]);

  /** Helpers */
  const openToast = (type, message) => {
    setToast({ open: true, type, message });
  };
  const closeToast = () => setToast({ open: false, type: 'success', message: '' });

  const handleSubmit = async (payload) => {
    try {
      if (editingId) {
        const updated = await dataService.update(editingId, payload);
        setItems((prev) => prev.map((it) => (it.id === editingId ? updated : it)));
        setEditingId(null);
        openToast('success', 'Snippet updated.');
      } else {
        const created = await dataService.create(payload);
        setItems((prev) => [created, ...prev]);
        openToast('success', 'Snippet added.');
      }
      return true;
    } catch (e) {
      openToast('error', 'Unable to save snippet.');
      return false;
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this snippet?')) return;
    try {
      await dataService.delete(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      if (editingId === id) setEditingId(null);
      openToast('success', 'Snippet deleted.');
    } catch (e) {
      openToast('error', 'Unable to delete snippet.');
    }
  };

  const editingItem = items.find((it) => it.id === editingId) || null;

  return (
    <div className="app-root" style={{ background: 'var(--bg-app)' }}>
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-title">
            <span className="badge">Python</span>
            <h1>Snippet Manager</h1>
          </div>
          <p className="subtitle">
            Add questions and Python code snippets. Expand cards to view details and copy code.
          </p>
        </div>
      </header>

      <main className="app-container">
        <section aria-label="Add or edit snippet" className="surface section">
          <SnippetForm
            key={editingItem ? editingItem.id : 'new'}
            initialValues={editingItem || undefined}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingId(null)}
          />
        </section>

        <section aria-label="Snippets list" className="section">
          <SnippetList items={items} onEdit={handleEdit} onDelete={handleDelete} />
          {items.length === 0 && (
            <div className="empty-state surface">
              <div className="empty-emoji" aria-hidden>🐍</div>
              <h3>No snippets yet</h3>
              <p>Use the form above to add your first Python question and code snippet.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p className="muted">Data stored locally in your browser. API can be enabled via env vars.</p>
      </footer>

      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={closeToast} />
    </div>
  );
}

export default App;
