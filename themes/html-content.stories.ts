import type { Meta, StoryObj } from '@storybook/angular';

const meta = {
  title: 'Foundations/HTML Content',
  parameters: {
    layout: 'padded',
  },
  render: () => ({
    template: `
      <article>
        <h1>Readable default HTML styling</h1>
        <p class="uc-lead">
          Shared prose defaults for headings, paragraphs, inline code, block code, lists, blockquotes, and tables.
        </p>
        <p>
          These styles apply automatically when the default theme stylesheet is imported.
        </p>

        <h2>Typography</h2>
        <p>
          Links inherit the content palette, so <a href="#">this anchor</a> picks up the same CSS variable-driven styling
          as surrounding copy. You can still emphasize text with <strong>strong</strong>, <em>emphasis</em>,
          <mark>mark</mark>, and keyboard input like <kbd>Ctrl</kbd> + <kbd>K</kbd>.
        </p>

        <h3>Utility classes</h3>
        <p>
          Utility classes remain available for explicit use: <code>uc-h1</code> through <code>uc-h6</code>,
          <code>uc-body</code>, <code>uc-muted</code>, <code>uc-code</code>, <code>uc-pre</code>, and <code>uc-table</code>.
        </p>

        <h3>Lists and quote</h3>
        <ul>
          <li>Ordered spacing and list rhythm are included by default.</li>
          <li>Inline snippets such as <code>npm run storybook</code> stay readable.</li>
          <li>Longer shell output can use the preformatted block style.</li>
        </ul>
        <blockquote>
          These defaults are meant to feel like a foundation layer, not a one-off marketing page treatment.
        </blockquote>

        <h3>Preformatted code</h3>
        <pre><code>import '@enumsoftware/universal-components/themes/theme.css';

      const link = document.createElement('a');
      link.textContent = 'Styled by theme defaults';</code></pre>

        <hr />

        <h2>Table defaults</h2>
        <div>
          <table>
            <caption>Deployment status overview</caption>
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Environment</th>
                <th scope="col">Status</th>
                <th scope="col">Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>API Gateway</td>
                <td>Production</td>
                <td><code>Healthy</code></td>
                <td>2 minutes ago</td>
              </tr>
              <tr>
                <td>Billing Worker</td>
                <td>Staging</td>
                <td><code>Queued</code></td>
                <td>14 minutes ago</td>
              </tr>
              <tr>
                <td>Reporting UI</td>
                <td>Preview</td>
                <td><code>Building</code></td>
                <td>31 minutes ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    `,
  }),
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Default: Story = {};