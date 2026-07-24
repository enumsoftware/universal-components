const SERIES_FALLBACK_COLORS = [
  '#473bf0',
  '#68d585',
  '#958ef6',
  '#f0a733',
  '#e05c5c',
  '#4ab5d4',
  '#f07c3b',
  '#a0d468',
];

const LINE_SERIES_FALLBACK_COLORS = [
  '#473bf0',
  '#ff6b6b',
  '#4ecdc4',
  '#ffe66d',
  '#95e1d3',
  '#f38181',
];

const BAR_HOVER_COLOR_FALLBACK = '#5b51f3';
const AXIS_COLOR_FALLBACK = 'var(--foreground-color)';
const MUTED_AXIS_COLOR_FALLBACK = 'var(--paragraph-text-color)';
const AXIS_LINE_COLOR_FALLBACK = 'rgba(255, 255, 255, 0.28)';
const MUTED_AXIS_LINE_COLOR_FALLBACK = 'rgba(255, 255, 255, 0.2)';
const GRID_COLOR_FALLBACK = 'rgba(255, 255, 255, 0.14)';
const LABEL_COLOR_FALLBACK = 'var(--foreground-color)';
const MUTED_LABEL_COLOR_FALLBACK = 'var(--paragraph-text-color)';

function getCssVariableExpression(variableName: string, fallbackValue: string): string {
  return `var(${variableName}, ${fallbackValue})`;
}

function getSharedSeriesVariableName(index: number): string {
  const normalizedIndex = index % SERIES_FALLBACK_COLORS.length;

  return `--uc-chart-series-${normalizedIndex + 1}`;
}

export function getChartSeriesColor(index: number): string {
  const normalizedIndex = index % SERIES_FALLBACK_COLORS.length;

  return getCssVariableExpression(getSharedSeriesVariableName(index), SERIES_FALLBACK_COLORS[normalizedIndex]);
}

export function getLineChartSeriesColor(index: number): string {
  const normalizedIndex = index % LINE_SERIES_FALLBACK_COLORS.length;
  const sharedFallback = getChartSeriesColor(index);

  return getCssVariableExpression(
    `--uc-line-chart-series-${normalizedIndex + 1}`,
    getCssVariableExpression(getSharedSeriesVariableName(index), LINE_SERIES_FALLBACK_COLORS[normalizedIndex])
  );
}

export function getDoughnutChartSeriesColor(index: number): string {
  return getCssVariableExpression(`--uc-doughnut-chart-series-${(index % SERIES_FALLBACK_COLORS.length) + 1}`, getChartSeriesColor(index));
}

export function getBarChartColor(): string {
  return getCssVariableExpression('--uc-bar-chart-color', getChartSeriesColor(0));
}

export function getBarChartHoverColor(): string {
  return getCssVariableExpression('--uc-bar-chart-hover-color', BAR_HOVER_COLOR_FALLBACK);
}

export function getChartAxisColor(): string {
  return getCssVariableExpression('--uc-chart-axis-color', AXIS_COLOR_FALLBACK);
}

export function getChartMutedAxisColor(): string {
  return getCssVariableExpression('--uc-chart-axis-muted-color', MUTED_AXIS_COLOR_FALLBACK);
}

export function getChartAxisLineColor(): string {
  return getCssVariableExpression('--uc-chart-axis-line-color', AXIS_LINE_COLOR_FALLBACK);
}

export function getChartMutedAxisLineColor(): string {
  return getCssVariableExpression('--uc-chart-axis-muted-line-color', MUTED_AXIS_LINE_COLOR_FALLBACK);
}

export function getChartGridColor(): string {
  return getCssVariableExpression('--uc-chart-grid-color', GRID_COLOR_FALLBACK);
}

export function getChartLabelColor(): string {
  return getCssVariableExpression('--uc-chart-label-color', LABEL_COLOR_FALLBACK);
}

export function getChartMutedLabelColor(): string {
  return getCssVariableExpression('--uc-chart-label-muted-color', MUTED_LABEL_COLOR_FALLBACK);
}