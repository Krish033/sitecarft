import type { AnimationConfig, AnimationType } from '../types/document';

// ─── Keyframe Definitions ────────────────────────────────────────────────────

const KEYFRAMES: Record<AnimationType, string> = {
  none: '',
  fadeIn: `
    @keyframes rsb-fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes rsb-slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `,
  slideDown: `
    @keyframes rsb-slideDown {
      from { opacity: 0; transform: translateY(-30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `,
  slideLeft: `
    @keyframes rsb-slideLeft {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `,
  slideRight: `
    @keyframes rsb-slideRight {
      from { opacity: 0; transform: translateX(-30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `,
  scale: `
    @keyframes rsb-scale {
      from { opacity: 0; transform: scale(0.85); }
      to   { opacity: 1; transform: scale(1); }
    }
  `,
};

const ANIMATION_NAMES: Record<AnimationType, string> = {
  none: '',
  fadeIn: 'rsb-fadeIn',
  slideUp: 'rsb-slideUp',
  slideDown: 'rsb-slideDown',
  slideLeft: 'rsb-slideLeft',
  slideRight: 'rsb-slideRight',
  scale: 'rsb-scale',
};

// ─── Inject Keyframes ────────────────────────────────────────────────────────

let injectedKeyframes = new Set<string>();
let styleElement: HTMLStyleElement | null = null;

function getStyleElement(): HTMLStyleElement {
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.setAttribute('data-rsb-animations', '');
    document.head.appendChild(styleElement);
  }
  return styleElement;
}

function injectKeyframes(type: AnimationType): void {
  if (type === 'none' || injectedKeyframes.has(type)) return;
  const el = getStyleElement();
  el.textContent += KEYFRAMES[type];
  injectedKeyframes.add(type);
}

// ─── Get Animation CSS ──────────────────────────────────────────────────────

/**
 * Generate inline style and CSS class info for a node's animation.
 * Injects the keyframe definition into the document head if needed.
 */
export function getAnimationStyle(
  animation: AnimationConfig | undefined
): React.CSSProperties {
  if (!animation || animation.type === 'none') return {};

  injectKeyframes(animation.type);

  const animName = ANIMATION_NAMES[animation.type];
  const duration = `${animation.duration}ms`;
  const delay = `${animation.delay}ms`;

  if (animation.trigger === 'onHover') {
    // For hover, we return the initial state; the hover state is handled via CSS class
    return {};
  }

  return {
    animation: `${animName} ${duration} ${delay} ease both`,
  };
}

/**
 * Generate a hover animation style string for use in custom CSS injection.
 */
export function getHoverAnimationCss(
  nodeId: string,
  animation: AnimationConfig
): string {
  if (animation.type === 'none' || animation.trigger !== 'onHover') return '';

  injectKeyframes(animation.type);

  const animName = ANIMATION_NAMES[animation.type];
  const duration = `${animation.duration}ms`;

  return `
    [data-node-id="${nodeId}"]:hover {
      animation: ${animName} ${duration} ease both;
    }
  `;
}

/**
 * Get data attributes for scroll-triggered animations.
 * The actual scroll observer is set up in the Canvas.
 */
export function getScrollAnimationAttrs(
  animation: AnimationConfig | undefined
): Record<string, string> {
  if (!animation || animation.type === 'none' || animation.trigger !== 'onScroll') {
    return {};
  }

  return {
    'data-rsb-animate': animation.type,
    'data-rsb-duration': String(animation.duration),
    'data-rsb-delay': String(animation.delay),
  };
}
