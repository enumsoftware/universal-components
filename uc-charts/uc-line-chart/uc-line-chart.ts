import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import {
  getChartAxisColor,
  getChartAxisLineColor,
  getChartGridColor,
  getChartMutedAxisColor,
  getChartMutedAxisLineColor,
  getLineChartSeriesColor,
} from '../uc-chart-palette';
import { UcLineChartInterpolation, UcLineChartSeries } from './uc-line-chart.model';

const TOOLTIP_OFFSET_X = 12;
const TOOLTIP_OFFSET_Y = 12;

@Component({
  selector: 'uc-line-chart',
  templateUrl: './uc-line-chart.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-line-chart.css',
  encapsulation: ViewEncapsulation.None,
})
export class UcLineChart implements OnDestroy {
  data = input.required<UcLineChartSeries[]>();
  height = input<number>(200);
  showLegend = input<boolean>(true);
  interpolationMode = input<UcLineChartInterpolation>('linear', { alias: 'interpolation' });

  private svgContainer = viewChild.required<ElementRef<HTMLElement>>('svgContainer');
  private resizeObserver: ResizeObserver | null = null;
  private seriesState = signal<Record<string, boolean>>({});

  constructor() {
    effect(() => {
      const data = this.data();
      const height = this.height();
      this.seriesState();
      const interpolation = this.interpolationMode();

      if (data) {
        this.render(data, height, interpolation);
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  getSeriesColor(series: UcLineChartSeries, index: number): string {
    return series.color || getLineChartSeriesColor(index);
  }

  getSeriesLegendValue(series: UcLineChartSeries): string {
    const lastPoint = series.data.at(-1);
    return lastPoint ? `${lastPoint.value}` : '-';
  }

  isSeriesEnabled(name: string): boolean {
    return this.seriesState()[name] ?? true;
  }

  canToggleSeries(name: string): boolean {
    const isEnabled = this.isSeriesEnabled(name);
    const enabledCount = this.data().filter((series) => this.isSeriesEnabled(series.name)).length;

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

  private render(series: UcLineChartSeries[], chartHeight: number, interpolation: UcLineChartInterpolation): void {
    const container = this.svgContainer().nativeElement;
    const axisColor = getChartAxisColor();
    const axisLineColor = getChartAxisLineColor();
    const mutedAxisColor = getChartMutedAxisColor();
    const mutedAxisLineColor = getChartMutedAxisLineColor();
    const gridColor = getChartGridColor();
    const mappedSeries = series.map((item, originalIndex) => ({
      ...item,
      originalIndex,
      enabled: this.isSeriesEnabled(item.name),
    }));
    const visibleSeries = mappedSeries.filter((item) => item.enabled);
    const xLabels = series[0]?.data.map((point) => point.label) || [];

    const measuredContainerWidth = container.clientWidth || Math.round(container.getBoundingClientRect().width) || 400;

    d3.select(container).selectAll('*').remove();

    const tooltip = d3.select(container).append('div').attr('class', 'uc-line-chart__tooltip').style('opacity', 0);
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

    const allValues = series.flatMap((s) => s.data.map((d) => d.value));
    const minValue = allValues.length > 0 ? Math.min(...allValues, 0) : 0;
    const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
    const padding = (maxValue - minValue) * 0.1 || 1;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', chartHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scalePoint<string>()
      .domain(xLabels)
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([minValue - padding, maxValue + padding])
      .range([height, 0]);

    const line = d3
      .line<{ label: string; value: number }>()
      .x(d => xScale(d.label)!)
      .y(d => yScale(d.value))
      .curve(
        interpolation === 'cubic'
          ? d3.curveCatmullRom.alpha(0.5)
          : interpolation === 'cubic-monotone'
            ? d3.curveMonotoneX
            : d3.curveLinear
      );

    svg
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(null as any)
      )
      .call((grid) => grid.select('.domain').remove())
      .call((grid) => grid.selectAll('.tick text').remove())
      .call((grid) => grid.selectAll('.tick line').attr('stroke', gridColor).attr('stroke-dasharray', '3,3').attr('stroke-opacity', 1));

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .call((axis) => axis.select('.domain').remove())
      .call((axis) => axis.selectAll('.tick line').attr('stroke', mutedAxisLineColor))
      .call((axis) => axis.selectAll('text').attr('fill', mutedAxisColor))
      .style('font-size', '12px');

    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .call((axis) => axis.select('.domain').remove())
      .call((axis) => axis.selectAll('.tick line').attr('stroke', axisLineColor))
      .call((axis) => axis.selectAll('text').attr('fill', axisColor))
      .style('font-size', '12px');

    visibleSeries.forEach((s) => {
      const color = this.getSeriesColor(s, s.originalIndex);
      const points = s.data.map((point) => ({ ...point, seriesName: s.name }));

      svg
        .append('path')
        .datum(s.data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line as any);

      svg
        .selectAll(`.dot-${s.originalIndex}`)
        .data(points)
        .enter()
        .append('circle')
        .attr('class', `dot-${s.originalIndex}`)
        .attr('cx', d => xScale(d.label)!)
        .attr('cy', d => yScale(d.value))
        .attr('r', 3)
        .attr('fill', color)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .on('mouseenter', function (event: MouseEvent, d) {
          d3.select(this).attr('r', 5);

          tooltip.style('opacity', 1);
          tooltipLabel.text(d.seriesName);
          tooltipValue.text(`${d.label}: ${d.value}`);

          positionTooltip(event);
        })
        .on('mousemove', function (event: MouseEvent) {
          positionTooltip(event);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('r', 3);
          tooltip.style('opacity', 0);
        });
    });

    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        const newContainerWidth = container.clientWidth;
        if (newContainerWidth !== containerWidth) {
          this.render(series, chartHeight, interpolation);
        }
      });
    }

    this.resizeObserver.observe(container);
  }
}
