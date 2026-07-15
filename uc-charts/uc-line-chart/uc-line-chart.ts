import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  effect,
  input,
  viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { getChartAxisColor, getChartGridColor, getChartMutedAxisColor, getLineChartSeriesColor } from '../uc-chart-palette';
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
  interpolationMode = input<UcLineChartInterpolation>('linear', { alias: 'interpolation' });

  private svgContainer = viewChild.required<ElementRef<HTMLElement>>('svgContainer');
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      const data = this.data();
      const height = this.height();
      const interpolation = this.interpolationMode();

      if (data) {
        this.render(data, height, interpolation);
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private render(series: UcLineChartSeries[], chartHeight: number, interpolation: UcLineChartInterpolation): void {
    const container = this.svgContainer().nativeElement;
    const axisColor = getChartAxisColor();
    const mutedAxisColor = getChartMutedAxisColor();
    const gridColor = getChartGridColor();

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
    const containerWidth = container.clientWidth || 400;
    const width = containerWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    const allValues = series.flatMap(s => s.data.map(d => d.value));
    const minValue = Math.min(...allValues, 0);
    const maxValue = Math.max(...allValues);
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
      .domain(series[0]?.data.map(d => d.label) || [])
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
      .call((grid) => grid.selectAll('.tick line').attr('stroke', gridColor).attr('stroke-opacity', 0.35));

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .call((axis) => axis.select('.domain').attr('stroke', mutedAxisColor))
      .call((axis) => axis.selectAll('.tick line').attr('stroke', mutedAxisColor))
      .call((axis) => axis.selectAll('text').attr('fill', mutedAxisColor))
      .style('font-size', '12px');

    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .call((axis) => axis.select('.domain').attr('stroke', axisColor))
      .call((axis) => axis.selectAll('.tick line').attr('stroke', axisColor))
      .call((axis) => axis.selectAll('text').attr('fill', axisColor))
      .style('font-size', '12px');

    series.forEach((s, index) => {
      const color = s.color || getLineChartSeriesColor(index);
      const points = s.data.map((point) => ({ ...point, seriesName: s.name }));

      svg
        .append('path')
        .datum(s.data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line as any);

      svg
        .selectAll(`.dot-${index}`)
        .data(points)
        .enter()
        .append('circle')
        .attr('class', `dot-${index}`)
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
