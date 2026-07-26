import type { Preview } from '@storybook/angular';

import '../themes/theme.css';

const SUPPORTED_THEMES = ['light', 'dark', 'aurora', 'midnight'] as const;

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Global theme for all component stories',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'aurora', title: 'Aurora' },
          { value: 'midnight', title: 'Midnight' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (storyFn, context) => {
      const selectedTheme = String(context.globals['theme'] ?? 'light');
      const resolvedTheme = SUPPORTED_THEMES.includes(selectedTheme as (typeof SUPPORTED_THEMES)[number])
        ? selectedTheme
        : 'light';

      document.documentElement.setAttribute('data-theme', resolvedTheme);
      document.body.setAttribute('data-theme', resolvedTheme);

      return storyFn();
    },
  ],
  parameters: {
    a11y: {
      test: 'error',
    },
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    options: {
      storySort: (left, right) => {
        const getSectionRank = (title) => {
          if (title.startsWith('Components/')) {
            return 0;
          }

          if (title.startsWith('Charts/')) {
            return 1;
          }

          return 2;
        };

        const leftRank = getSectionRank(left.title);
        const rightRank = getSectionRank(right.title);

        if (leftRank !== rightRank) {
          return leftRank - rightRank;
        }

        return left.title.localeCompare(right.title, undefined, { numeric: true });
      },
    },
  },
};

export default preview;
