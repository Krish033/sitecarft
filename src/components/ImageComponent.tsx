import React from 'react';
import type { NodeComponentProps } from '../types/editor';

/**
 * Image — renders an <img> with optional placeholder in editor mode.
 */
export function ImageComponent({
  node,
  resolvedStyles,
  isEditor,
}: NodeComponentProps) {
  const src = (node.props.src as string) || '';
  const alt = (node.props.alt as string) || 'Image';
  const objectFit = (node.props.objectFit as string) || 'cover';

  if (!src && isEditor) {
    return (
      <div
        className="rsb-component rsb-image rsb-image--placeholder"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
          background: '#f0f0f5',
          border: '2px dashed #c0c0d0',
          borderRadius: '8px',
          minHeight: '120px',
          color: '#8888a0',
          fontSize: '14px',
          ...resolvedStyles,
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span>Select an image</span>
      </div>
    );
  }

  if (!src) return null;

  return (
    <img
      className="rsb-component rsb-image"
      src={src}
      alt={alt}
      style={{
        display: 'block',
        maxWidth: '100%',
        objectFit: objectFit as React.CSSProperties['objectFit'],
        ...resolvedStyles,
      }}
    />
  );
}
