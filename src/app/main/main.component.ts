import { Component } from '@angular/core';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(private router: Router, private roleService: RoleService) {}

  selectRole(role: 'User' | 'Admin') {
    this.roleService.setRole(role);
    this.router.navigate(['/home']);
  }
}
