import React, { useCallback, useRef } from 'react';
import type { NodeComponentProps } from '../types/editor';

/**
 * Text — renders a paragraph with inline editing support.
 */
export function TextComponent({
  node,
  resolvedStyles,
  isEditor,
  onUpdateProps,
}: NodeComponentProps) {
  const text = (node.props.text as string) || 'Text block';
  const ref = useRef<HTMLParagraphElement>(null);

  const handleBlur = useCallback(() => {
    if (ref.current && onUpdateProps) {
      const newText = ref.current.innerText || '';
      if (newText !== text) {
        onUpdateProps({ text: newText });
      }
    }
  }, [text, onUpdateProps]);

  return (
    <p
      ref={ref}
      className="rsb-component rsb-text"
      style={{
        margin: 0,
        outline: 'none',
        whiteSpace: 'pre-wrap',
        ...resolvedStyles,
      }}
      contentEditable={isEditor}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
    >
      {text}
    </p>
  );
}
