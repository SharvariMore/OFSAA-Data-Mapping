import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { IndexComponent } from './index/index.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { DataMappingRuleComponent } from './data-mapping-rule/data-mapping-rule.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'home', component: AppComponent},
  {path: 'index', component: IndexComponent},
  {path: 'changelog', component: ChangelogComponent},
  {path: 'data-mapping-rule', component: DataMappingRuleComponent},
  // {path: '**', redirectTo: 'main'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes), NgxPaginationModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
