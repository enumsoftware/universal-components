import {
  Component,
  input,
  ElementRef,
  viewChild,
  effect,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import * as d3 from 'd3';
import { UcLineChartSeries } from './uc-line-chart.model';

const DEFAULT_COLORS = [
  '#473bf0',
  '#ff6b6b',
  '#4ecdc4',
  '#ffe66d',
  '#95e1d3',
  '#f38181',
];

const TOOLTIP_OFFSET_X = 12;
const TOOLTIP_OFFSET_Y = 12;

@Component({
  selector: 'uc-line-chart',
  templateUrl: './uc-line-chart.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-line-chart.css',
})
export class UcLineChart implements OnDestroy {
  data = input.required<UcLineChartSeries[]>();
  height = input<number>(200);

  private svgContainer = viewChild.required<ElementRef<HTMLElement>>('svgContainer');
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      const data = this.data();
      const height = this.height();
      if (data) {
        this.render(data, height);
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private render(series: UcLineChartSeries[], chartHeight: number): void {
    const container = this.svgContainer().nativeElement;
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

    /* Flatten all data points to find min/max values */
    const allValues = series.flatMap(s => s.data.map(d => d.value));
    const minValue = Math.min(...allValues, 0);
    const maxValue = Math.max(...allValues);
    const padding = (maxValue - minValue) * 0.1 || 1;

    /* Create SVG */
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', chartHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    /* Create scales */
    const xScale = d3
      .scalePoint<string>()
      .domain(series[0]?.data.map(d => d.label) || [])
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([minValue - padding, maxValue + padding])
      .range([height, 0]);

    /* Create line generator */
    const line = d3
      .line<{ label: string; value: number }>()
      .x(d => xScale(d.label)!)
      .y(d => yScale(d.value));

    /* Add grid lines */
    svg
      .append('g')
      .attr('class', 'grid')
      .style('opacity', 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(null as any)
      );

    /* Add X axis */
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .style('font-size', '12px');

    /* Add Y axis */
    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .style('font-size', '12px');

    /* Draw lines and dots for each series */
    series.forEach((s, index) => {
      const color = s.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
      const points = s.data.map((point) => ({ ...point, seriesName: s.name }));

      /* Draw line path */
      svg
        .append('path')
        .datum(s.data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line as any);

      /* Draw dots */
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

    /* Setup resize observer */
    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        const newContainerWidth = container.clientWidth;
        if (newContainerWidth !== containerWidth) {
          this.render(series, chartHeight);
        }
      });
    }
    this.resizeObserver.observe(container);
  }
}
