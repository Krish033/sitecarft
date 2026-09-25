import React from 'react';
import type { NodeComponentProps } from '../types/editor';
import { PlusIcon } from './Icons';

/**
 * Column — flex child inside a Row.
 */
export function ColumnComponent({
  node,
  resolvedStyles,
  isEditor,
  children,
}: NodeComponentProps) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div
      className="rsb-component rsb-column"
      style={{
        flex: '1',
        minWidth: '0',
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
            Empty Column — Drop elements here or click from sidebar
          </span>
        </div>
      )}
    </div>
  );
}

