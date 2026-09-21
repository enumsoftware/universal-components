import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';

import { UcAvatar } from '../../../uc-avatar/uc-avatar';
import { UcBarChart } from '../../../uc-charts/uc-bar-chart/uc-bar-chart';
import type { UcBarChartDataPoint } from '../../../uc-charts/uc-bar-chart/uc-bar-chart.model';
import { UcLineChart } from '../../../uc-charts/uc-line-chart/uc-line-chart';
import type { UcLineChartSeries } from '../../../uc-charts/uc-line-chart/uc-line-chart.model';
import { UcCard } from '../../../uc-card/uc-card';
import { UcPagination } from '../../../uc-pagination/uc-pagination';
import { UcPill, type PillVariant } from '../../../uc-pill/uc-pill';
import { UcSelect, type SelectOption } from '../../../uc-select/uc-select';
import { UcTabPanel, UcTabs, type UcTab } from '../../../uc-tabs/uc-tabs';
import { avatarColorFor, initialsFor } from '../shared/demo-utils';

type TicketStatus = 'Open' | 'Pending' | 'Closed';
type TicketPriority = 'Low' | 'Medium' | 'High';

interface Ticket {
  readonly id: string;
  readonly subject: string;
  readonly requester: string;
  readonly status: TicketStatus;
  readonly priority: TicketPriority;
  readonly updated: string;
}

interface StatTile {
  readonly label: string;
  readonly value: string;
  readonly trend: string;
  readonly trendVariant: PillVariant;
}

const STAT_TILES: readonly StatTile[] = [
  { label: 'Open tickets', value: '42', trend: '+12% vs last week', trendVariant: 'error' },
  { label: 'Avg response time', value: '2.4h', trend: '-18% vs last week', trendVariant: 'valid' },
  { label: 'Resolved this week', value: '128', trend: '+6% vs last week', trendVariant: 'valid' },
  { label: 'CSAT score', value: '96%', trend: '+2 pts vs last week', trendVariant: 'valid' },
];

const VOLUME_DATA: UcBarChartDataPoint[] = [
  { label: 'Apr', value: 86 },
  { label: 'May', value: 102 },
  { label: 'Jun', value: 94 },
  { label: 'Jul', value: 118 },
  { label: 'Aug', value: 131 },
  { label: 'Sep', value: 122 },
];

const RESPONSE_DATA: UcLineChartSeries[] = [
  {
    name: 'Avg response (hours)',
    data: [
      { label: 'Apr', value: 4.1 },
      { label: 'May', value: 3.6 },
      { label: 'Jun', value: 3.8 },
      { label: 'Jul', value: 3.1 },
      { label: 'Aug', value: 2.7 },
      { label: 'Sep', value: 2.4 },
    ],
  },
];

const TICKETS: readonly Ticket[] = [
  { id: 'T-1042', subject: 'Cannot reset password', requester: 'Ava Jensen', status: 'Open', priority: 'High', updated: '12m ago' },
  { id: 'T-1041', subject: 'Export is missing a column', requester: 'Noah Whitfield', status: 'Pending', priority: 'Medium', updated: '38m ago' },
  { id: 'T-1039', subject: 'Billing charged twice', requester: 'Priya Anand', status: 'Open', priority: 'High', updated: '1h ago' },
  { id: 'T-1035', subject: 'Feature request: dark mode', requester: 'Marcus Cole', status: 'Closed', priority: 'Low', updated: '3h ago' },
  { id: 'T-1032', subject: 'Slow dashboard load', requester: 'Lena Fischer', status: 'Pending', priority: 'Medium', updated: '5h ago' },
  { id: 'T-1030', subject: 'Invite link expired', requester: 'Diego Ramirez', status: 'Open', priority: 'Medium', updated: '6h ago' },
  { id: 'T-1027', subject: 'API returns 500 on upload', requester: 'Sofia Moretti', status: 'Open', priority: 'High', updated: '8h ago' },
  { id: 'T-1021', subject: 'Typo on the pricing page', requester: 'Ethan Brooks', status: 'Closed', priority: 'Low', updated: '1d ago' },
  { id: 'T-1018', subject: 'SSO login loop', requester: 'Grace Kim', status: 'Closed', priority: 'Medium', updated: '2d ago' },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'Open', label: 'Open' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Closed', label: 'Closed' },
];

const STATUS_VARIANT: Record<TicketStatus, PillVariant> = {
  Open: 'info',
  Pending: 'default',
  Closed: 'valid',
};

const PRIORITY_VARIANT: Record<TicketPriority, PillVariant> = {
  High: 'error',
  Medium: 'info',
  Low: 'default',
};

const TICKET_PAGE_SIZE = 4;

/**
 * A support-desk overview: stat tiles, a chart that swaps datasets through
 * uc-tabs, and a filterable, paginated ticket list - the "dashboard" shape
 * most of these components end up composed into.
 */
@Component({
  selector: 'wb-support-dashboard-example',
  imports: [
    UcAvatar,
    UcBarChart,
    UcCard,
    UcLineChart,
    UcPagination,
    UcPill,
    UcSelect,
    UcTabPanel,
    UcTabs,
  ],
  templateUrl: './support-dashboard.html',
  styleUrl: './support-dashboard.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class WbSupportDashboardExample {
  protected readonly statTiles = STAT_TILES;
  protected readonly volumeData = VOLUME_DATA;
  protected readonly responseData = RESPONSE_DATA;
  protected readonly statusOptions = STATUS_OPTIONS;

  protected readonly chartTabs: UcTab[] = [
    { key: 'volume', label: 'Ticket Volume' },
    { key: 'response', label: 'Response Time' },
  ];

  protected readonly activeChartTab = signal('volume');
  protected readonly statusFilter = signal('all');
  protected readonly currentPage = signal(0);

  protected readonly filteredTickets = computed(() => {
    const status = this.statusFilter();
    return status === 'all' ? TICKETS : TICKETS.filter((ticket) => ticket.status === status);
  });

  protected readonly pagedTickets = computed(() => {
    const start = this.currentPage() * TICKET_PAGE_SIZE;
    return this.filteredTickets().slice(start, start + TICKET_PAGE_SIZE);
  });

  protected readonly pageSize = TICKET_PAGE_SIZE;

  protected onChartTabChange(key: string): void {
    this.activeChartTab.set(key);
  }

  protected onStatusChange(value: string | null): void {
    this.statusFilter.set(value ?? 'all');
    this.currentPage.set(0);
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  protected statusVariant(status: TicketStatus): PillVariant {
    return STATUS_VARIANT[status];
  }

  protected priorityVariant(priority: TicketPriority): PillVariant {
    return PRIORITY_VARIANT[priority];
  }

  protected initialsFor = initialsFor;
  protected avatarColorFor = avatarColorFor;
}
