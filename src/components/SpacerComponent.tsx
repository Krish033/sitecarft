import React from 'react';
import type { NodeComponentProps } from '../types/editor';

/**
 * Spacer — empty vertical space.
 */
export function SpacerComponent({
  node,
  resolvedStyles,
  isEditor,
}: NodeComponentProps) {
  const height = (node.props.height as string) || '40px';

  return (
    <div
      className="rsb-component rsb-spacer"
      style={{
        height,
        width: '100%',
        ...resolvedStyles,
      }}
    >
      {isEditor && (
        <div
          className="rsb-spacer__indicator"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #c0c0d0',
            borderRadius: '4px',
            color: '#8888a0',
            fontSize: '11px',
            userSelect: 'none',
          }}
        >
          Spacer ({height})
        </div>
      )}
    </div>
  );
}
