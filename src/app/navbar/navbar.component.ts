import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isNavbarOpen: boolean = false;
  currentRole: string | undefined;
  dropdownOpen: boolean = false;

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.roleService.role$.subscribe((role) => {
      this.currentRole = role;
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Toggles the role and closes the dropdown
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
}
