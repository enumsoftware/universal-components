import {
  Component,
  input,
  ElementRef,
  viewChild,
  effect,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import * as d3 from 'd3';
import { UcBarChartDataPoint, UcBarChartInput, UcBarChartSeries } from './uc-bar-chart.model';
import {
  getBarChartColor,
  getBarChartHoverColor,
  getChartAxisColor,
  getChartAxisLineColor,
  getChartGridColor,
  getChartMutedAxisColor,
  getChartMutedAxisLineColor,
  getChartSeriesColor,
} from '../uc-chart-palette';

const TOOLTIP_OFFSET_X = 12;
const TOOLTIP_OFFSET_Y = 12;

@Component({
  selector: 'uc-bar-chart',
  templateUrl: './uc-bar-chart.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-bar-chart.css',
  encapsulation: ViewEncapsulation.None,
})
export class UcBarChart implements OnDestroy {
  data = input.required<UcBarChartInput>();
  height = input<number>(200);
  showLegend = input<boolean>(true);

  private svgContainer = viewChild.required<ElementRef<HTMLElement>>('svgContainer');
  private resizeObserver: ResizeObserver | null = null;
  private seriesState = signal<Record<string, boolean>>({});

  constructor() {
    effect(() => {
      const data = this.data();
      const height = this.height();
      this.seriesState();
      if (data) {
        this.render(data, height);
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  getLegendSeries(): UcBarChartSeries[] {
    return this.normalizeSeries(this.data());
  }

  getSeriesColor(series: UcBarChartSeries, index: number): string {
    return series.color || getChartSeriesColor(index);
  }

  getSeriesLegendValue(series: UcBarChartSeries): string {
    const lastPoint = series.data.at(-1);
    return lastPoint ? `${lastPoint.value}` : '-';
  }

  formatTooltipValue(point: UcBarChartDataPoint & { seriesName: string; color: string }): string {
    return point.percentage !== undefined ? `${point.value} (${point.percentage}%)` : `${point.value}`;
  }

  isSeriesEnabled(name: string): boolean {
    return this.seriesState()[name] ?? true;
  }

  canToggleSeries(name: string): boolean {
    const isEnabled = this.isSeriesEnabled(name);
    const enabledCount = this.getLegendSeries().filter((series) => this.isSeriesEnabled(series.name)).length;

    return !isEnabled || enabledCount > 1;
  }

  toggleSeries(name: string): void {
    if (!this.canToggleSeries(name)) {
      return;
    }

    this.seriesState.update((state) => ({
      ...state,
      [name]: !(state[name] ?? true),
    }));
  }

  private normalizeSeries(data: UcBarChartInput): UcBarChartSeries[] {
    if (!data.length) {
      return [];
    }

    // Preserve backward compatibility by adapting legacy flat data into a single synthetic series.
    const firstItem = data[0];
    const isMultiSeries = Array.isArray((firstItem as UcBarChartSeries).data);

    if (isMultiSeries) {
      return (data as UcBarChartSeries[]).map((series, index) => ({
        ...series,
        color: series.color || getChartSeriesColor(index),
      }));
    }

    return [
      {
        name: 'Series 1',
        data: data as UcBarChartDataPoint[],
        color: getBarChartColor(),
      },
    ];
  }

  private render(data: UcBarChartInput, chartHeight: number): void {
    const container = this.svgContainer().nativeElement;
    const axisColor = getChartAxisColor();
    const axisLineColor = getChartAxisLineColor();
    const mutedAxisColor = getChartMutedAxisColor();
    const mutedAxisLineColor = getChartMutedAxisLineColor();
    const gridColor = getChartGridColor();
    const allSeries = this.normalizeSeries(data).map((series, index) => ({
      ...series,
      color: series.color || getChartSeriesColor(index),
      originalIndex: index,
    }));
    const visibleSeries = allSeries
      .map((series, index) => ({
        ...series,
        enabled: this.isSeriesEnabled(series.name),
        color: series.color || getChartSeriesColor(index),
        originalIndex: series.originalIndex ?? index,
      }))
      .filter((series) => series.enabled);

    if (!visibleSeries.length) {
      d3.select(container).selectAll('*').remove();
      return;
    }

    const categories = Array.from(new Set(allSeries.flatMap((series) => series.data.map((point) => point.label))));
    const maxValue = Math.max(...allSeries.flatMap((series) => series.data.map((point) => point.value)), 0);

    const measuredContainerWidth = container.clientWidth || Math.round(container.getBoundingClientRect().width) || 400;

    d3.select(container).selectAll('*').remove();

    const tooltip = d3.select(container).append('div').attr('class', 'uc-bar-chart__tooltip').style('opacity', 0);
    const tooltipLabel = tooltip.append('strong');
    const tooltipValue = tooltip.append('span');

    const positionTooltip = (event: MouseEvent): void => {
      const bounds = container.getBoundingClientRect();
      tooltip
        .style('left', `${event.clientX - bounds.left + TOOLTIP_OFFSET_X}px`)
        .style('top', `${event.clientY - bounds.top - TOOLTIP_OFFSET_Y}px`);
    };

    const margin = { top: 8, right: 16, bottom: 24, left: 32 };
    const containerWidth = measuredContainerWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', chartHeight)
      .attr('viewBox', `0 0 ${containerWidth} ${chartHeight}`)
      .attr('aria-hidden', 'true');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x0 = d3
      .scaleBand<string>()
      .domain(categories)
      .range([0, width])
      .padding(0.2);

    const x1 = d3
      .scaleBand<string>()
      .domain(visibleSeries.map((series) => series.name))
      .range([0, x0.bandwidth()])
      .padding(0.12);

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(maxValue, 1)])
      .nice()
      .range([height, 0]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0).tickSizeOuter(0))
      .call((axis) => axis.select('.domain').remove())
      .call((axis) => axis.selectAll('.tick line').attr('stroke', mutedAxisLineColor))
      .selectAll('text')
      .attr('fill', mutedAxisColor)
      .attr('font-size', '0.75rem');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
      .call((axis) => axis.select('.domain').remove())
      .call((axis) => axis.selectAll('.tick line').attr('stroke', axisLineColor))
      .selectAll('text')
      .attr('fill', axisColor)
      .attr('font-size', '0.875rem');

    g.selectAll('.grid-line')
      .data(y.ticks(5))
      .join('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', gridColor)
      .attr('stroke-dasharray', '3,3');

    visibleSeries.forEach((series) => {
      const hoverColor = this.getSeriesHoverColor(series.color, allSeries.length === 1);
      const seriesPoints = categories.map((label) => {
        const matchingPoint = series.data.find((point) => point.label === label);

        return {
          label,
          value: matchingPoint?.value ?? 0,
          percentage: matchingPoint?.percentage ?? 0,
          seriesName: series.name,
          color: this.getSeriesColor(series, series.originalIndex),
        };
      });

      const bars = g
        .selectAll<SVGRectElement, (UcBarChartDataPoint & { seriesName: string; color: string })>(`.bar-${series.originalIndex}`)
        .data(seriesPoints)
        .join('rect')
        .attr('class', `bar-${series.originalIndex}`)
        .attr('x', (d) => (x0(d.label) ?? 0) + (x1(series.name) ?? 0))
        .attr('y', (d) => y(Math.max(d.value, 0)))
        .attr('width', x1.bandwidth())
        .attr('height', (d) => height - y(Math.max(d.value, 0)))
        .attr('fill', series.color)
        .attr('rx', 4)
        .style('cursor', 'pointer')
        .on('mouseenter', (event: MouseEvent, d) => {
          d3.select(event.currentTarget as Element).attr('fill', hoverColor);

          tooltip.style('opacity', 1);
          tooltipLabel.text(allSeries.length > 1 ? `${d.seriesName} · ${d.label}` : d.label);
          tooltipValue.text(this.formatTooltipValue(d));

          positionTooltip(event);
        })
        .on('mousemove', function (event: MouseEvent) {
          positionTooltip(event);
        })
        .on('mouseleave', function (event: MouseEvent) {
          d3.select(event.currentTarget as Element).attr('fill', series.color);
          tooltip.style('opacity', 0);
        });

      bars
        .transition()
        .duration(400)
        .attr('y', (d) => y(Math.max(d.value, 0)))
        .attr('height', (d) => height - y(Math.max(d.value, 0)));
    });
  }

  private getSeriesHoverColor(seriesColor: string, isSingleSeries: boolean): string {
    if (isSingleSeries) {
      return getBarChartHoverColor();
    }

    return `color-mix(in srgb, ${seriesColor} 82%, black)`;
  }
}
