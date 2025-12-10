import React, { useState } from 'react';

/**
 * @param {{ code: string, language?: string }} props
 */
const CodeBlock = ({ code, language = 'python' }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="code-block" role="region" aria-label={`${language} code`}>
      <button className="copy-btn" onClick={copy} aria-label="Copy code">
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre style={{ margin: 0 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
