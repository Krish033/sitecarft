import type { StyleProperties, ResponsiveStyles, Viewport } from '../types/document';

/**
 * Resolve responsive styles for a given viewport.
 *
 * Desktop styles serve as the base. Tablet inherits from desktop,
 * and mobile inherits from tablet (which already includes desktop).
 *
 * Only explicitly-set properties at each breakpoint override inherited values.
 */
export function resolveStyles(
  responsiveStyles: ResponsiveStyles | undefined,
  viewport: Viewport
): React.CSSProperties {
  if (!responsiveStyles) return {};

  const desktop = responsiveStyles.desktop || {};

  if (viewport === 'desktop') {
    return stylePropertiesToCss(desktop);
  }

  const tablet = { ...desktop, ...(responsiveStyles.tablet || {}) };

  if (viewport === 'tablet') {
    return stylePropertiesToCss(tablet);
  }

  // Mobile inherits from tablet (which already includes desktop)
  const mobile = { ...tablet, ...(responsiveStyles.mobile || {}) };
  return stylePropertiesToCss(mobile);
}

/**
 * Convert our StyleProperties (camelCase) to React.CSSProperties.
 * Filters out undefined values.
 */
function stylePropertiesToCss(props: StyleProperties): React.CSSProperties {
  const css: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined && value !== null && value !== '') {
      css[key] = value;
    }
  }

  return css as React.CSSProperties;
}

/**
 * Get the value of a style property for a specific viewport,
 * without inheritance. Returns undefined if the property
 * is not explicitly set for that viewport.
 */
export function getExplicitStyleValue<K extends keyof StyleProperties>(
  responsiveStyles: ResponsiveStyles | undefined,
  viewport: Viewport,
  property: K
): StyleProperties[K] | undefined {
  if (!responsiveStyles) return undefined;
  const viewportStyles = responsiveStyles[viewport];
  if (!viewportStyles) return undefined;
  return viewportStyles[property];
}

/**
 * Get the effective (resolved/inherited) value of a style property
 * for a given viewport.
 */
export function getResolvedStyleValue<K extends keyof StyleProperties>(
  responsiveStyles: ResponsiveStyles | undefined,
  viewport: Viewport,
  property: K
): StyleProperties[K] | undefined {
  const resolved = resolveStyles(responsiveStyles, viewport);
  return (resolved as Record<string, unknown>)[property] as StyleProperties[K] | undefined;
}

// ─── Viewport Dimensions ────────────────────────────────────────────────────

export const VIEWPORT_WIDTHS: Record<Viewport, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

export const VIEWPORT_LABELS: Record<Viewport, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};
