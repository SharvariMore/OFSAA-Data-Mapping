import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  constructor(private roleService: RoleService) {}

  isAdmin(): boolean {
    return this.roleService.getRole() === 'admin';
  }

  addData() {
    alert('Add content clicked!');
  }

  editData() {
    alert('Edit content clicked!');
  }
}
