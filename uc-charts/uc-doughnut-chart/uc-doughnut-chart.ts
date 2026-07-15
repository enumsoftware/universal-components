import {
  Component,
  input,
  signal,
  ElementRef,
  viewChild,
  effect,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import * as d3 from 'd3';
import { UcDoughnutChartDataPoint } from './uc-doughnut-chart.model';
import { getChartLabelColor, getChartMutedLabelColor, getDoughnutChartSeriesColor } from '../uc-chart-palette';

const TOOLTIP_OFFSET_X = 12;
const TOOLTIP_OFFSET_Y = 12;

type UcDoughnutChartSeries = UcDoughnutChartDataPoint & {
  colorIndex: number;
  enabled: boolean;
};

@Component({
  selector: 'uc-doughnut-chart',
  templateUrl: './uc-doughnut-chart.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-doughnut-chart.css',
})
export class UcDoughnutChart implements OnDestroy {
  data = input.required<UcDoughnutChartDataPoint[]>();
  size = input<number>(240);
  showLegend = input<boolean>(true);
  doughnutTitle = input<string | undefined>(undefined);
  doughnutSubtitle = input<string | undefined>(undefined);

  private svgContainer = viewChild.required<ElementRef<HTMLElement>>('svgContainer');
  private resizeObserver: ResizeObserver | null = null;
  private seriesState = signal<Record<string, boolean>>({});

  constructor() {
    effect(() => {
      const data = this.data();
      const size = this.size();
      this.seriesState();
      if (data) {
        this.render(data, size);
      }
    });
  }

  getColor(index: number): string {
    return getDoughnutChartSeriesColor(index);
  }

  isSeriesEnabled(label: string): boolean {
    return this.seriesState()[label] ?? true;
  }

  toggleSeries(label: string): void {
    this.seriesState.update((state) => ({
      ...state,
      [label]: !(state[label] ?? true),
    }));
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private render(data: UcDoughnutChartDataPoint[], size: number): void {
    const container = this.svgContainer().nativeElement;
    const labelColor = getChartLabelColor();
    const mutedLabelColor = getChartMutedLabelColor();
    const centerValueText = this.doughnutTitle() ?? '';
    const centerLabelText = this.doughnutSubtitle() ?? '';
    const series = data.map((item, colorIndex) => ({
      ...item,
      colorIndex,
      enabled: this.isSeriesEnabled(item.label),
    }));
    const visibleSeries = series.filter((item) => item.enabled);

    d3.select(container).selectAll('*').remove();

    const tooltip = d3.select(container).append('div').attr('class', 'uc-doughnut-chart__tooltip').style('opacity', 0);
    const tooltipLabel = tooltip.append('strong');
    const tooltipValue = tooltip.append('span');

    const positionTooltip = (event: MouseEvent): void => {
      const bounds = container.getBoundingClientRect();
      tooltip
        .style('left', `${event.clientX - bounds.left + TOOLTIP_OFFSET_X}px`)
        .style('top', `${event.clientY - bounds.top - TOOLTIP_OFFSET_Y}px`);
    };

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
      .pie<UcDoughnutChartSeries>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<UcDoughnutChartSeries>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 4);

    const hoverArc = d3
      .arc<d3.PieArcDatum<UcDoughnutChartSeries>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const arcs = g
      .selectAll<SVGGElement, d3.PieArcDatum<UcDoughnutChartSeries>>('.arc')
      .data(pie(visibleSeries))
      .join('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => getDoughnutChartSeriesColor(d.data.colorIndex))
      .attr('stroke', 'var(--background-color)')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.2s')
      .on('mouseenter', function (event: MouseEvent, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', hoverArc(d) ?? '');

        tooltip.style('opacity', 1);
        tooltipLabel.text(d.data.label);
        tooltipValue.text(`${d.data.value} (${d.data.percentage}%)`);

        positionTooltip(event);
      })
      .on('mousemove', function (event: MouseEvent) {
        positionTooltip(event);
      })
      .on('mouseleave', function (_, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arc(d) ?? '');

        tooltip.style('opacity', 0);
      });

    g.append('text')
      .attr('class', 'uc-doughnut-chart__title')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.3em')
      .attr('font-size', 'var(--uc-doughnut-chart-title-font-size)')
      .attr('font-weight', '700')
      .attr('fill', labelColor)
      .text(centerValueText);

    g.append('text')
      .attr('class', 'uc-doughnut-chart__subtitle')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .attr('font-size', 'var(--uc-doughnut-chart-subtitle-font-size)')
      .attr('fill', mutedLabelColor)
      .text(centerLabelText);
  }
}