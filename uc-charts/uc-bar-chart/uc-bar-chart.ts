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
import { UcBarChartDataPoint } from './uc-bar-chart.model';

const BAR_COLOR = '#473bf0';

@Component({
  selector: 'uc-bar-chart',
  templateUrl: './uc-bar-chart.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-bar-chart.css',
})
export class UcBarChart implements OnDestroy {
  data = input.required<UcBarChartDataPoint[]>();
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

  private render(data: UcBarChartDataPoint[], chartHeight: number): void {
    const container = this.svgContainer().nativeElement;
    d3.select(container).selectAll('*').remove();

    const margin = { top: 8, right: 16, bottom: 24, left: 32 };
    const containerWidth = container.clientWidth || 400;
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

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) ?? 1])
      .nice()
      .range([0, width]);

    const y = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.label))
      .range([0, height])
      .padding(0.3);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
      .call((axis) => axis.select('.domain').remove())
      .selectAll('text')
      .attr('fill', 'var(--paragraph-text-color)')
      .attr('font-size', '0.75rem');

    g.append('g')
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call((axis) => axis.select('.domain').remove())
      .selectAll('text')
      .attr('fill', 'var(--foreground-color)')
      .attr('font-size', '0.875rem');

    g.selectAll('.grid-line')
      .data(x.ticks(5))
      .join('line')
      .attr('class', 'grid-line')
      .attr('x1', (d) => x(d))
      .attr('x2', (d) => x(d))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'var(--background-color-90)')
      .attr('stroke-dasharray', '3,3');

    g.selectAll<SVGRectElement, UcBarChartDataPoint>('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('y', (d) => y(d.label) ?? 0)
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0)
      .attr('fill', BAR_COLOR)
      .attr('rx', 4)
      .transition()
      .duration(400)
      .attr('width', (d) => x(d.value));

    g.selectAll<SVGTextElement, UcBarChartDataPoint>('.bar-label')
      .data(data)
      .join('text')
      .attr('class', 'bar-label')
      .attr('y', (d) => (y(d.label) ?? 0) + y.bandwidth() / 2 + 1)
      .attr('x', (d) => x(d.value) + 6)
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '0.75rem')
      .attr('fill', 'var(--paragraph-text-color)')
      .text((d) => `${d.value} (${d.percentage}%)`);
  }
}
