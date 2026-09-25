import React from 'react';
import type { NodeComponentProps } from '../types/editor';

/**
 * PageComponent — Root container for the page.
 */
export function PageComponent({
  node,
  resolvedStyles,
  children,
}: NodeComponentProps) {
  return (
    <div
      className="rsb-page"
      data-node-id={node.id}
      style={{
        minHeight: '100%',
        backgroundColor: '#ffffff',
        ...resolvedStyles,
      }}
    >
      {children}
    </div>
  );
}
