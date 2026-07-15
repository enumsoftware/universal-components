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
import { UcPieChartDataPoint } from './uc-pie-chart.model';

const CHART_COLORS = [
  '#473bf0',
  '#68d585',
  '#958ef6',
  '#f0a733',
  '#e05c5c',
  '#4ab5d4',
  '#f07c3b',
  '#a0d468',
];

@Component({
  selector: 'uc-pie-chart',
  templateUrl: './uc-pie-chart.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-pie-chart.css',
})
export class UcPieChart implements OnDestroy {
  data = input.required<UcPieChartDataPoint[]>();
  size = input<number>(240);

  private svgContainer = viewChild.required<ElementRef<HTMLElement>>('svgContainer');
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      const data = this.data();
      const size = this.size();
      if (data) {
        this.render(data, size);
      }
    });
  }

  getColor(index: number): string {
    return CHART_COLORS[index % CHART_COLORS.length];
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private render(data: UcPieChartDataPoint[], size: number): void {
    const container = this.svgContainer().nativeElement;
    d3.select(container).selectAll('*').remove();

    const radius = size / 2;
    const innerRadius = radius * 0.55;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .attr('viewBox', `0 0 ${size} ${size}`)
      .attr('aria-hidden', 'true');

    const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);

    const pie = d3
      .pie<UcPieChartDataPoint>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<UcPieChartDataPoint>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 4);

    const hoverArc = d3
      .arc<d3.PieArcDatum<UcPieChartDataPoint>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const arcs = g
      .selectAll<SVGGElement, d3.PieArcDatum<UcPieChartDataPoint>>('.arc')
      .data(pie(data))
      .join('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (_, i) => CHART_COLORS[i % CHART_COLORS.length])
      .attr('stroke', 'var(--background-color)')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.2s')
      .on('mouseenter', function (_, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', hoverArc(d) ?? '');
      })
      .on('mouseleave', function (_, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arc(d) ?? '');
      });

    const totalResponses = data.reduce((sum, d) => sum + d.value, 0);
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.3em')
      .attr('font-size', '1.5rem')
      .attr('font-weight', '700')
      .attr('fill', 'var(--foreground-color)')
      .text(totalResponses.toString());

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('font-size', '0.75rem')
      .attr('fill', 'var(--paragraph-text-color)')
      .text('responses');
  }
}
