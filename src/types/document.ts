// ─── Node Types ──────────────────────────────────────────────────────────────

export type NodeType =
  | 'page'
  | 'section'
  | 'container'
  | 'row'
  | 'column'
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'custom-html';

/** Node types that can contain children */
export const CONTAINER_TYPES: NodeType[] = [
  'page',
  'section',
  'container',
  'row',
  'column',
];

// ─── Viewport & Responsive Styles ────────────────────────────────────────────

export type Viewport = 'desktop' | 'tablet' | 'mobile';

export interface StyleProperties {
  // Layout
  display?: string;
  position?: 'static' | 'relative' | 'absolute';
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;

  // Flexbox
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: string;
  alignItems?: string;
  flex?: string;
  gap?: string;

  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Appearance
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
  opacity?: number;
  boxShadow?: string;
  overflow?: string;

  // Image
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export type ResponsiveStyles = {
  [K in Viewport]?: StyleProperties;
};

// ─── Animation ───────────────────────────────────────────────────────────────

export type AnimationType =
  | 'none'
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale';

export type AnimationTrigger = 'onLoad' | 'onScroll' | 'onHover';

export interface AnimationConfig {
  type: AnimationType;
  trigger: AnimationTrigger;
  duration: number;
  delay: number;
}

// ─── Node ────────────────────────────────────────────────────────────────────

export interface Node {
  id: string;
  type: NodeType;
  props: Record<string, unknown>;
  styles?: ResponsiveStyles;
  children: string[];
  animation?: AnimationConfig;
  customCss?: string;
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

// ─── Page Metadata ───────────────────────────────────────────────────────────

export interface PageMetadata {
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'draft' | 'published';
  publishedAt?: string;
}

// ─── Page Document ───────────────────────────────────────────────────────────

export interface PageDocument {
  id: string;
  name: string;
  root: string;
  nodes: Record<string, Node>;
  theme: Theme;
  metadata?: PageMetadata;
}

// ─── Asset ───────────────────────────────────────────────────────────────────

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'svg' | 'video';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  size?: number;
  mimeType?: string;
}

// ─── Builder Props ───────────────────────────────────────────────────────────

export interface BuilderProps {
  /** The page document to edit */
  value?: PageDocument;
  /** Called whenever the document changes */
  onChange?: (document: PageDocument) => void;
  /** Called when the user clicks Save */
  onSave?: (document: PageDocument) => void;
  /** Called when the user clicks Publish */
  onPublish?: (document: PageDocument) => void;
  /** Resolve an asset ID to its URL */
  onResolveAsset?: (assetId: string) => Promise<string>;
  /** Upload a file and return asset metadata */
  onUploadAsset?: (file: File) => Promise<Asset>;
  /** Browse available assets */
  onBrowseAssets?: () => Promise<Asset[]>;
}
