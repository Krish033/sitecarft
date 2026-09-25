import React from 'react';
import type { NodeComponentProps } from '../types/editor';

import { PlusIcon } from './Icons';

/**
 * Section — full-width layout container.
 * Establishes a positioning context for absolutely-positioned children.
 */
export function SectionComponent({
  node,
  resolvedStyles,
  isEditor,
  children,
}: NodeComponentProps) {
  const label = (node.props.label as string) || 'Section';
  const hasChildren = node.children && node.children.length > 0;

  return (
    <section
      className="rsb-component rsb-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: !hasChildren ? '60px' : undefined,
        boxSizing: 'border-box',
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
            Empty Section — Drop components here or click from sidebar
          </span>
        </div>
      )}
    </section>
  );
}

