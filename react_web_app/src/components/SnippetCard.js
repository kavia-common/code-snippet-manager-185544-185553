import React, { useState } from 'react';
import CodeBlock from './shared/CodeBlock';

/**
 * @param {{ item: { id: string, title: string, description: string, code: string, createdAt: number, updatedAt: number }, onEdit: ()=>void, onDelete: ()=>void }} props
 */
const SnippetCard = ({ item, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="card" aria-expanded={expanded}>
      <div className="card-header">
        <div>
          <h3 className="card-title">{item.title}</h3>
          <div className="card-meta">
            <span className="badge" aria-label="Python code">PY</span>
            <span className="muted" title={new Date(item.updatedAt).toLocaleString()}>
              Updated {timeAgo(item.updatedAt)}
            </span>
          </div>
        </div>
        <div className="card-actions">
          <button className="btn small ghost" onClick={() => setExpanded(e => !e)}>
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          <button className="btn small" onClick={onEdit}>Edit</button>
          <button className="btn small danger" onClick={onDelete}>Delete</button>
        </div>
      </div>

      {expanded && (
        <div className="card-details">
          {item.description && (
            <p style={{ marginTop: 0, marginBottom: 10 }}>{item.description}</p>
          )}
          <CodeBlock language="python" code={item.code} />
        </div>
      )}
    </article>
  );
};

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  return `${d}d ago`;
}

export default SnippetCard;
