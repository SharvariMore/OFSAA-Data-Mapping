import { RoleService } from './role.service';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
// import { NavbarComponent } from './navbar/navbar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'OFSAA_Data_Mapping';

  role: 'User' | 'Admin' | undefined;

  constructor(private roleService: RoleService, private router: Router) {
    // this.router = router;
    this.role = this.roleService.getRole();
  }

  goToIndex() {
    this.router.navigate(['/index']);
  }

  goToChangeLog() {
    this.router.navigate(['/changelog']);
  }

  goToDataMappingRule() {
    this.router.navigate(['/data-mapping-rule']);
  }
}
