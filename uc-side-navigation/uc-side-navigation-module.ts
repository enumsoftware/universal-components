import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcSidebar } from './uc-sidebar/uc-sidebar';
import { UcSideNavigation } from './uc-side-navigation';

const COMPONENTS = [UcSidebar, UcSideNavigation];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...COMPONENTS],
  exports: [...COMPONENTS],
})
export class UcSideNavigationModule {}
