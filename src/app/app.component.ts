import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OFSAA_Data_Mapping';

  public router: Router;

  constructor(router: Router) {
    this.router = router;
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
