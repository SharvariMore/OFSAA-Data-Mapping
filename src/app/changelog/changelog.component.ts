import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css'
})
export class ChangelogComponent {
  constructor(private roleService: RoleService) {}

  isAdmin(): boolean {
    return this.roleService.getRole() === 'Admin';
  }

  addChange() {
    alert('Add content clicked!');
  }

  editChange() {
    alert('Edit content clicked!');
  }
}
