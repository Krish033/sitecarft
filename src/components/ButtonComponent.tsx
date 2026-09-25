import React, { useCallback, useRef } from 'react';
import type { NodeComponentProps } from '../types/editor';

/**
 * Button — renders a styled button. Non-interactive in editor mode.
 */
export function ButtonComponent({
  node,
  resolvedStyles,
  isEditor,
  onUpdateProps,
}: NodeComponentProps) {
  const text = (node.props.text as string) || 'Button';
  const url = (node.props.url as string) || '#';
  const variant = (node.props.variant as string) || 'primary';
  const ref = useRef<HTMLButtonElement>(null);

  const handleBlur = useCallback(() => {
    if (ref.current && onUpdateProps) {
      const newText = ref.current.textContent || '';
      if (newText !== text) {
        onUpdateProps({ text: newText });
      }
    }
  }, [text, onUpdateProps]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isEditor) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isEditor]
  );

  return (
    <button
      ref={ref}
      className={`rsb-component rsb-button rsb-button--${variant}`}
      style={{
        cursor: isEditor ? 'default' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        transition: 'all 0.2s ease',
        ...resolvedStyles,
      }}
      contentEditable={isEditor}
      suppressContentEditableWarning={true}
      onClick={handleClick}
      onBlur={handleBlur}
    >
      {text}
    </button>
  );
}
