import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoleService } from '../role.service';
import { TabService } from '../tab.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isNavbarOpen: boolean = false;
  currentRole: string | undefined;
  dropdownOpen: boolean = false;
  tabs: string[] = ['Pre-Stage Table', 'Stage Table', 'Lookup Table'];
  activeTab: string = this.tabs[0];
  selectedTables: string[] = [];

  constructor(private roleService: RoleService, private tabService: TabService, private activatedRoute: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.roleService.role$.subscribe((role) => {
      this.currentRole = role;
    });

    this.router.events.subscribe(() => {
      if (this.router.url.startsWith('/data-mapping-rule')) {
        this.showTabs();
      } else {
        this.hideTabs();
      }
    });

    // this.tabService.selectedTables$.subscribe((selectedTables) => {
    //   this.selectedTables = selectedTables;
    // });
    // Subscribe to both current row ID and row-to-tables mapping
    combineLatest([
      this.tabService.currentRowId$,
      this.tabService.selectedTables$
    ]).subscribe(([rowId, mapping]) => {
      if (rowId !== null) {
        this.selectedTables = mapping[rowId] || [];
      } else {
        this.selectedTables = [];
      }
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Toggles role and closes dropdown
  toggleRole(): void {
    this.roleService.toggleRole();
    this.dropdownOpen = false;
  }

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  getOtherRole(): 'User' | 'Admin' {
    return this.currentRole === 'User' ? 'Admin' : 'User';
  }

  switchTab(tab: string): void {
    // this.activeTab = tab;
    // this.tabService.setActiveTab(tab);
    if (this.selectedTables.includes(tab)) {
      this.activeTab = tab;
      this.tabService.setActiveTab(tab);
    }
  }

  showTabs(): void {
    this.activeTab = this.tabs[0];
  }

  hideTabs(): void {
    this.activeTab = '';
  }

  isTabDisabled(tab: string): boolean {
    return !this.selectedTables.includes(tab);
  }
}
