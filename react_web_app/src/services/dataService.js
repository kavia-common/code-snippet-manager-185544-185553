const STORAGE_KEY = 'snippet_items_v1';

function uuid() {
  // Basic UUID-ish generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** LocalStorage implementation */
const localImpl = {
  async list() {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch {
      return [];
    }
  },
  _save(items) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },
  async create(payload) {
    const now = Date.now();
    const item = {
      id: uuid(),
      title: payload.title,
      description: payload.description || '',
      code: payload.code,
      createdAt: now,
      updatedAt: now,
    };
    const list = await this.list();
    const updated = [item, ...list];
    this._save(updated);
    return item;
  },
  async update(id, payload) {
    const list = await this.list();
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error('Not found');
    const now = Date.now();
    const updated = {
      ...list[idx],
      title: payload.title,
      description: payload.description || '',
      code: payload.code,
      updatedAt: now,
    };
    const newList = [...list];
    newList[idx] = updated;
    this._save(newList);
    return updated;
  },
  async delete(id) {
    const list = await this.list();
    const newList = list.filter((x) => x.id !== id);
    this._save(newList);
    return true;
  },
};

/** API implementation placeholder (not used unless envs set) */
const apiBase =
  (process.env.REACT_APP_API_BASE || '').trim() ||
  (process.env.REACT_APP_BACKEND_URL || '').trim();

const apiImpl = {
  async list() {
    const r = await fetch(`${apiBase}/snippets`);
    if (!r.ok) throw new Error('Failed list');
    return r.json();
  },
  async create(payload) {
    const r = await fetch(`${apiBase}/snippets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('Failed create');
    return r.json();
  },
  async update(id, payload) {
    const r = await fetch(`${apiBase}/snippets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('Failed update');
    return r.json();
  },
  async delete(id) {
    const r = await fetch(`${apiBase}/snippets/${id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error('Failed delete');
    return true;
  },
};

// PUBLIC_INTERFACE
export function createDataService() {
  /**
   * Decide backend: if REACT_APP_API_BASE or REACT_APP_BACKEND_URL provided and non-empty, use API impl.
   * Defaults to localStorage implementation.
   */
  if (apiBase) {
    return apiImpl;
  }
  return localImpl;
}
