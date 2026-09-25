import React from 'react';
import type { NodeComponentProps } from '../types/editor';

import { PlusIcon } from './Icons';

/**
 * Row — horizontal flex container.
 */
export function RowComponent({
  node,
  resolvedStyles,
  isEditor,
  children,
}: NodeComponentProps) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div
      className="rsb-component rsb-row"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        boxSizing: 'border-box',
        position: 'relative',
        minHeight: !hasChildren ? '60px' : undefined,
        ...resolvedStyles,
      }}
    >
      {children}
      {isEditor && (!node.children || node.children.length === 0) && (
        <div className="rsb-empty-container">
          <span className="rsb-empty-container__icon">
            <PlusIcon size={16} />
          </span>
          <span className="rsb-empty-container__text">
            Empty Row — Drop columns here or click from sidebar
          </span>
        </div>
      )}
    </div>
  );
}

