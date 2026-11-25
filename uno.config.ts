import { defineConfig, presetWind4, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  content: {
    pipeline: {
      exclude: ['node_modules']
    }
  },
  safelist: [],
  transformers: [
    transformerDirectives() // 启用指令转换器
  ],
  theme: {
    // 所有色值统一引用 variables.css 中的令牌，保证浅色/深色只维护一处
    colors: {
      brand: {
        50: 'var(--color-brand-50)',
        100: 'var(--color-brand-100)',
        200: 'var(--color-brand-200)',
        500: 'var(--color-brand-500)',
        600: 'var(--color-brand-600)',
        700: 'var(--color-brand-700)',
        solid: {
          DEFAULT: 'var(--color-brand-solid)',
          hover: 'var(--color-brand-solid-hover)'
        },
        soft: 'var(--color-brand-soft)',
        softer: 'var(--color-brand-softer)'
      },
      'on-brand': 'var(--color-on-brand)',

      ink: {
        900: 'var(--color-ink-900)',
        700: 'var(--color-ink-700)',
        600: 'var(--color-ink-600)',
        500: 'var(--color-ink-500)',
        400: 'var(--color-ink-400)',
        300: 'var(--color-ink-300)'
      },

      line: {
        300: 'var(--color-line-300)',
        200: 'var(--color-line-200)',
        100: 'var(--color-line-100)'
      },

      surface: {
        rail: 'var(--color-surface-rail)',
        panel: 'var(--color-surface-panel)',
        base: 'var(--color-surface-base)',
        subtle: 'var(--color-surface-subtle)',
        muted: 'var(--color-surface-muted)'
      },
      canvas: 'var(--color-canvas)',

      success: {
        600: 'var(--color-success-600)',
        100: 'var(--color-success-100)'
      },
      danger: {
        600: 'var(--color-danger-600)',
        100: 'var(--color-danger-100)'
      },
      warn: {
        600: 'var(--color-warn-600)',
        100: 'var(--color-warn-100)'
      },

      code: {
        bg: 'var(--color-code-bg)',
        ink: 'var(--color-code-ink)',
        line: 'var(--color-code-line)'
      }
    },
    // 输入区阴影：常态投影 + 聚焦时的品牌色光晕
    shadow: {
      composer: '0 14px 34px -24px rgba(23, 26, 33, 0.45)',
      'composer-focus':
        '0 0 0 3px var(--color-brand-softer), 0 14px 34px -24px rgba(23, 26, 33, 0.45)',
      sendButton:
        '0 8px 16px -8px color-mix(in srgb, var(--color-brand-solid) 80%, transparent)'
    }
  }
})
