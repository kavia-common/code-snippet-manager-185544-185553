import React from 'react';
import SnippetCard from './SnippetCard';

/**
 * @param {{ items: Array<{id: string, title: string, description: string, code: string, createdAt: number, updatedAt: number}>, onEdit: (id: string)=>void, onDelete: (id: string)=>void }} props
 */
const SnippetList = ({ items, onEdit, onDelete }) => {
  return (
    <div aria-live="polite" aria-relevant="additions removals">
      {items.map(item => (
        <SnippetCard key={item.id} item={item} onEdit={() => onEdit(item.id)} onDelete={() => onDelete(item.id)} />
      ))}
    </div>
  );
};

export default SnippetList;
