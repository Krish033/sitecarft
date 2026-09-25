import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import type { NodeComponentProps } from '../types/editor';

/**
 * CustomHtml — renders sanitized HTML with optional custom CSS.
 * Uses DOMPurify to mitigate XSS risks.
 */
export function CustomHtmlComponent({
  node,
  resolvedStyles,
  isEditor,
}: NodeComponentProps) {
  const html = (node.props.html as string) || '';
  const css = (node.props.css as string) || '';

  const sanitizedHtml = useMemo(() => {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ['style'],
      ADD_ATTR: ['style', 'class', 'id'],
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    });
  }, [html]);

  return (
    <div className="rsb-component rsb-custom-html" style={resolvedStyles}>
      {css && <style>{css}</style>}
      {isEditor && !html && (
        <div
          style={{
            padding: '20px',
            background: '#f5f5fa',
            border: '2px dashed #c0c0d0',
            borderRadius: '8px',
            color: '#8888a0',
            fontSize: '13px',
            textAlign: 'center',
          }}
        >
          Custom HTML Block — Edit in the inspector
        </div>
      )}
      {sanitizedHtml && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      )}
    </div>
  );
}
