import React, { useCallback, useRef } from 'react';
import type { NodeComponentProps } from '../types/editor';

/**
 * Heading — renders h1-h6 with inline editing support.
 */
export function HeadingComponent({
  node,
  resolvedStyles,
  isEditor,
  onUpdateProps,
}: NodeComponentProps) {
  const text = (node.props.text as string) || 'Heading';
  const level = (node.props.level as number) || 2;
  const ref = useRef<HTMLHeadingElement>(null);

  const handleBlur = useCallback(() => {
    if (ref.current && onUpdateProps) {
      const newText = ref.current.textContent || '';
      if (newText !== text) {
        onUpdateProps({ text: newText });
      }
    }
  }, [text, onUpdateProps]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  }, []);

  const Tag = `h${Math.min(Math.max(level, 1), 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <Tag
      ref={ref as any}
      className="rsb-component rsb-heading"
      style={{
        margin: 0,
        outline: 'none',
        ...resolvedStyles,
      }}
      contentEditable={isEditor}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onKeyDown={isEditor ? handleKeyDown : undefined}
    >
      {text}
    </Tag>
  );
}
