import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { DataMappingRuleComponent } from './data-mapping-rule/data-mapping-rule.component';

export const routes: Routes = [
  {path: 'index', component: IndexComponent},
  {path: 'changelog', component: ChangelogComponent},
  {path: 'data-mapping-rule', component: DataMappingRuleComponent},
  {path: 'index', redirectTo: '/', pathMatch: 'full'},
];
