import React, { useEffect, useMemo, useState } from 'react';

/**
 * @param {{ initialValues?: { id?: string, title?: string, description?: string, code?: string }, onSubmit: (payload: {title: string, description: string, code: string}) => Promise<boolean>, onCancelEdit?: () => void }} props
 */
const SnippetForm = ({ initialValues, onSubmit, onCancelEdit }) => {
  const isEdit = !!(initialValues && initialValues.id);
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [code, setCode] = useState(initialValues?.code || '');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTitle(initialValues?.title || '');
    setDescription(initialValues?.description || '');
    setCode(initialValues?.code || '');
  }, [initialValues]);

  const valid = useMemo(() => title.trim().length > 0 && code.trim().length > 0, [title, code]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!code.trim()) errs.code = 'Code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const ok = await onSubmit({ title: title.trim(), description: description.trim(), code: code });
    setSubmitting(false);
    if (ok && !isEdit) {
      setTitle('');
      setDescription('');
      setCode('');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label className="label" htmlFor="title">Question title <span style={{ color: 'var(--primary)' }}>*</span></label>
        <input
          id="title"
          className="input"
          placeholder="e.g., How to reverse a list in Python?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <span style={{ color: 'var(--error)', fontSize: 12 }}>{errors.title}</span>}
      </div>

      <div className="form-row">
        <label className="label" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="textarea"
          placeholder="Add context or notes (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-row">
        <label className="label" htmlFor="code">Code (Python) <span style={{ color: 'var(--primary)' }}>*</span></label>
        <textarea
          id="code"
          className="textarea"
          placeholder={`def reverse_list(lst):\n    return list(reversed(lst))`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {errors.code && <span style={{ color: 'var(--error)', fontSize: 12 }}>{errors.code}</span>}
      </div>

      <div className="actions">
        {isEdit && (
          <button type="button" className="btn ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn primary" disabled={!valid || submitting}>
          {isEdit ? (submitting ? 'Saving...' : 'Save') : (submitting ? 'Adding...' : 'Add')}
        </button>
      </div>
    </form>
  );
};

export default SnippetForm;
