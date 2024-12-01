import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-mapping-rule',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './data-mapping-rule.component.html',
  styleUrl: './data-mapping-rule.component.css'
})
export class DataMappingRuleComponent {
  constructor(private roleService: RoleService) {}

  isAdmin(): boolean {
    return this.roleService.getRole() === 'admin';
  }

  addMap() {
    alert('Add content clicked!');
  }

  editMap() {
    alert('Edit content clicked!');
  }
}
