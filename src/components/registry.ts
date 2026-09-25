import React from 'react';
import type { NodeType } from '../types/document';
import type { ComponentDefinition, NodeComponentProps } from '../types/editor';

// ── Component Imports ────────────────────────────────────────────────────────
import { SectionComponent } from './SectionComponent';
import { ContainerComponent } from './ContainerComponent';
import { RowComponent } from './RowComponent';
import { ColumnComponent } from './ColumnComponent';
import { HeadingComponent } from './HeadingComponent';
import { TextComponent } from './TextComponent';
import { ImageComponent } from './ImageComponent';
import { ButtonComponent } from './ButtonComponent';
import { DividerComponent } from './DividerComponent';
import { SpacerComponent } from './SpacerComponent';
import { CustomHtmlComponent } from './CustomHtmlComponent';
import { PageComponent } from './PageComponent';

// ─── Component Registry ─────────────────────────────────────────────────────

type ComponentRenderer = React.FC<NodeComponentProps>;

const COMPONENT_MAP: Record<string, ComponentRenderer> = {
  page: PageComponent,
  section: SectionComponent,
  container: ContainerComponent,
  row: RowComponent,
  column: ColumnComponent,
  heading: HeadingComponent,
  text: TextComponent,
  image: ImageComponent,
  button: ButtonComponent,
  divider: DividerComponent,
  spacer: SpacerComponent,
  'custom-html': CustomHtmlComponent,
};

/**
 * Look up the React component for a given node type.
 */
export function getComponentForType(type: string): ComponentRenderer | null {
  return COMPONENT_MAP[type] || null;
}

// ─── Component Definitions (for the sidebar) ────────────────────────────────

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  // Layout
  {
    type: 'section',
    label: 'Section',
    icon: 'section',
    category: 'layout',
    isContainer: true,
  },
  {
    type: 'container',
    label: 'Container',
    icon: 'container',
    category: 'layout',
    isContainer: true,
  },
  {
    type: 'row',
    label: 'Row',
    icon: 'row',
    category: 'layout',
    isContainer: true,
    allowedChildren: ['column'],
  },
  {
    type: 'column',
    label: 'Column',
    icon: 'column',
    category: 'layout',
    isContainer: true,
    allowedParents: ['row'],
  },

  // Basic
  {
    type: 'heading',
    label: 'Heading',
    icon: 'heading',
    category: 'basic',
    isContainer: false,
  },
  {
    type: 'text',
    label: 'Text',
    icon: 'text',
    category: 'basic',
    isContainer: false,
  },
  {
    type: 'image',
    label: 'Image',
    icon: 'image',
    category: 'basic',
    isContainer: false,
  },
  {
    type: 'button',
    label: 'Button',
    icon: 'button',
    category: 'basic',
    isContainer: false,
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: 'divider',
    category: 'basic',
    isContainer: false,
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: 'spacer',
    category: 'basic',
    isContainer: false,
  },
  {
    type: 'custom-html',
    label: 'Custom HTML',
    icon: 'custom-html',
    category: 'basic',
    isContainer: false,
  },
];


// ─── Unknown Component ──────────────────────────────────────────────────────

export function UnknownComponent({ node }: NodeComponentProps) {
  return React.createElement(
    'div',
    {
      className: 'rsb-component rsb-unknown',
      style: {
        padding: '16px',
        background: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '6px',
        color: '#856404',
        fontSize: '13px',
        textAlign: 'center',
      },
    },
    'Unknown component: ',
    React.createElement('code', null, node.type)
  );
}

