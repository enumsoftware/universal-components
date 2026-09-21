import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';

import { UcAvatar } from '../../../uc-avatar/uc-avatar';
import { UcButton } from '../../../uc-button/uc-button';
import { UcCard } from '../../../uc-card/uc-card';
import { UcIconButton } from '../../../uc-icon-button/uc-icon-button';
import { UcInput } from '../../../uc-input/uc-input';
import { UcPagination } from '../../../uc-pagination/uc-pagination';
import { UcPhosphorIcon } from '../../../uc-phosphor-icon/uc-phosphor-icon';
import { UcPill } from '../../../uc-pill/uc-pill';
import { UcSelect, type SelectOption } from '../../../uc-select/uc-select';
import { avatarColorFor, initialsFor } from '../shared/demo-utils';

type Department = 'Engineering' | 'Design' | 'Sales' | 'Support';
type MemberStatus = 'Active' | 'Invited';

interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly department: Department;
  readonly status: MemberStatus;
}

const MEMBERS: readonly TeamMember[] = [
  { id: '1', name: 'Ava Jensen', email: 'ava.jensen@example.com', department: 'Engineering', status: 'Active' },
  { id: '2', name: 'Noah Whitfield', email: 'noah.whitfield@example.com', department: 'Design', status: 'Active' },
  { id: '3', name: 'Priya Anand', email: 'priya.anand@example.com', department: 'Engineering', status: 'Invited' },
  { id: '4', name: 'Marcus Cole', email: 'marcus.cole@example.com', department: 'Sales', status: 'Active' },
  { id: '5', name: 'Lena Fischer', email: 'lena.fischer@example.com', department: 'Support', status: 'Active' },
  { id: '6', name: 'Diego Ramirez', email: 'diego.ramirez@example.com', department: 'Sales', status: 'Invited' },
  { id: '7', name: 'Sofia Moretti', email: 'sofia.moretti@example.com', department: 'Design', status: 'Active' },
  { id: '8', name: 'Ethan Brooks', email: 'ethan.brooks@example.com', department: 'Engineering', status: 'Active' },
  { id: '9', name: 'Grace Kim', email: 'grace.kim@example.com', department: 'Support', status: 'Invited' },
  { id: '10', name: 'Oliver Bennett', email: 'oliver.bennett@example.com', department: 'Engineering', status: 'Active' },
  { id: '11', name: 'Maya Patel', email: 'maya.patel@example.com', department: 'Design', status: 'Active' },
  { id: '12', name: 'Liam Osei', email: 'liam.osei@example.com', department: 'Sales', status: 'Active' },
];

const DEPARTMENT_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Design', label: 'Design' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Support', label: 'Support' },
];

/**
 * A searchable, paginated member list - the toolbar row lines up uc-input,
 * uc-select and uc-button at the same height, and each row lines up
 * uc-avatar, uc-pill and uc-icon-button against that same baseline.
 */
@Component({
  selector: 'wb-team-directory-example',
  imports: [
    UcAvatar,
    UcButton,
    UcCard,
    UcIconButton,
    UcInput,
    UcPagination,
    UcPhosphorIcon,
    UcPill,
    UcSelect,
  ],
  templateUrl: './team-directory.html',
  styleUrl: './team-directory.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class WbTeamDirectoryExample {
  protected readonly departmentOptions = DEPARTMENT_OPTIONS;

  protected readonly search = signal('');
  protected readonly department = signal('all');
  protected readonly currentPage = signal(0);
  protected readonly pageSize = signal(5);

  protected readonly filteredMembers = computed(() => {
    const query = this.search().trim().toLowerCase();
    const department = this.department();

    return MEMBERS.filter((member) => {
      const matchesDepartment = department === 'all' || member.department === department;
      const matchesQuery =
        query.length === 0 ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query);

      return matchesDepartment && matchesQuery;
    });
  });

  protected readonly pagedMembers = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.filteredMembers().slice(start, start + this.pageSize());
  });

  protected onSearchChange(value: string | number | null): void {
    this.search.set(value === null ? '' : String(value));
    this.currentPage.set(0);
  }

  protected onDepartmentChange(value: string | null): void {
    this.department.set(value ?? 'all');
    this.currentPage.set(0);
  }

  protected onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  protected onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }

  protected initialsFor = initialsFor;
  protected avatarColorFor = avatarColorFor;
}
