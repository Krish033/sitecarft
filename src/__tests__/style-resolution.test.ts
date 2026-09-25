import {
  resolveStyles,
  getExplicitStyleValue,
  getResolvedStyleValue,
  VIEWPORT_WIDTHS,
  VIEWPORT_LABELS,
} from '../renderer/style-resolver';
import type { ResponsiveStyles } from '../types/document';

describe('Responsive Style Resolution', () => {
  it('returns empty object when responsiveStyles is undefined', () => {
    expect(resolveStyles(undefined, 'desktop')).toEqual({});
    expect(resolveStyles(undefined, 'tablet')).toEqual({});
    expect(resolveStyles(undefined, 'mobile')).toEqual({});
  });

  it('resolves desktop base styles correctly', () => {
    const styles: ResponsiveStyles = {
      desktop: {
        fontSize: '48px',
        padding: '40px',
        color: '#333333',
      },
    };

    const resolved = resolveStyles(styles, 'desktop');
    expect(resolved).toEqual({
      fontSize: '48px',
      padding: '40px',
      color: '#333333',
    });
  });

  it('inherits desktop styles on tablet and overrides explicit values', () => {
    const styles: ResponsiveStyles = {
      desktop: {
        fontSize: '48px',
        padding: '40px',
        color: '#333333',
      },
      tablet: {
        fontSize: '36px',
        padding: '24px',
      },
    };

    const resolved = resolveStyles(styles, 'tablet');
    expect(resolved).toEqual({
      fontSize: '36px', // Overridden
      padding: '24px',  // Overridden
      color: '#333333', // Inherited from desktop
    });
  });

  it('inherits tablet and desktop styles on mobile and overrides explicit values', () => {
    const styles: ResponsiveStyles = {
      desktop: {
        fontSize: '48px',
        padding: '40px',
        color: '#333333',
        backgroundColor: '#ffffff',
      },
      tablet: {
        fontSize: '36px',
        padding: '24px',
      },
      mobile: {
        fontSize: '24px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
      },
    };

    const resolved = resolveStyles(styles, 'mobile');
    expect(resolved).toEqual({
      fontSize: '24px',        // Overridden on mobile
      padding: '16px',         // Overridden on mobile
      backgroundColor: '#f5f5f5', // Overridden on mobile
      color: '#333333',        // Inherited through tablet from desktop
    });
  });

  it('handles absolute positioning properties correctly', () => {
    const styles: ResponsiveStyles = {
      desktop: {
        position: 'absolute',
        top: '20px',
        right: '40px',
        width: '300px',
        height: '200px',
        zIndex: 10,
      },
    };

    const resolved = resolveStyles(styles, 'desktop');
    expect(resolved).toEqual({
      position: 'absolute',
      top: '20px',
      right: '40px',
      width: '300px',
      height: '200px',
      zIndex: 10,
    });
  });

  it('filters out undefined and empty string values', () => {
    const styles: ResponsiveStyles = {
      desktop: {
        fontSize: '16px',
        color: '',
        margin: undefined,
      },
    };

    const resolved = resolveStyles(styles, 'desktop');
    expect(resolved).toEqual({
      fontSize: '16px',
    });
  });

  describe('getExplicitStyleValue vs getResolvedStyleValue', () => {
    const styles: ResponsiveStyles = {
      desktop: {
        fontSize: '48px',
        color: '#000000',
      },
      tablet: {
        fontSize: '36px',
      },
    };

    it('returns only explicit value without inheritance', () => {
      expect(getExplicitStyleValue(styles, 'tablet', 'fontSize')).toBe('36px');
      expect(getExplicitStyleValue(styles, 'tablet', 'color')).toBeUndefined();
      expect(getExplicitStyleValue(styles, 'desktop', 'color')).toBe('#000000');
    });

    it('returns inherited resolved value', () => {
      expect(getResolvedStyleValue(styles, 'tablet', 'fontSize')).toBe('36px');
      expect(getResolvedStyleValue(styles, 'tablet', 'color')).toBe('#000000');
      expect(getResolvedStyleValue(styles, 'mobile', 'color')).toBe('#000000');
    });
  });

  describe('Viewport constants', () => {
    it('provides standard viewport widths and labels', () => {
      expect(VIEWPORT_WIDTHS.desktop).toBe(1280);
      expect(VIEWPORT_WIDTHS.tablet).toBe(768);
      expect(VIEWPORT_WIDTHS.mobile).toBe(375);

      expect(VIEWPORT_LABELS.desktop).toBe('Desktop');
      expect(VIEWPORT_LABELS.tablet).toBe('Tablet');
      expect(VIEWPORT_LABELS.mobile).toBe('Mobile');
    });
  });
});
