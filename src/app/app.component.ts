import { RoleService } from './role.service';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
// import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OFSAA_Data_Mapping';

  role: 'user' | 'admin' | undefined;

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
