import React from 'react';
import type { NodeComponentProps } from '../types/editor';

/**
 * Divider — a horizontal line separator.
 */
export function DividerComponent({
  node,
  resolvedStyles,
}: NodeComponentProps) {
  const lineStyle = (node.props.lineStyle as string) || 'solid';
  const thickness = (node.props.thickness as string) || '1px';
  const color = (node.props.color as string) || '#e0e0e0';

  return (
    <hr
      className="rsb-component rsb-divider"
      style={{
        border: 'none',
        borderTop: `${thickness} ${lineStyle} ${color}`,
        width: '100%',
        ...resolvedStyles,
      }}
    />
  );
}
