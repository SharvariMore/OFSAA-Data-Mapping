import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private selectedTablesSubject = new BehaviorSubject<string[]>([]);
  selectedTables$ = this.selectedTablesSubject.asObservable();

  private activeTabSubject = new BehaviorSubject<string>('Pre-Stage Table');
  activeTab$ = this.activeTabSubject.asObservable();

  constructor() { }

  // Update selected tables based on the IndexComponent selection
  updateSelectedTables(tables: string[]): void {
    this.selectedTablesSubject.next(tables);
  }

  // Add a table to the selected list
  addSelectedTable(table: string): void {
    const currentTables = this.selectedTablesSubject.getValue();
    if (!currentTables.includes(table)) {
      currentTables.push(table);
      this.selectedTablesSubject.next([...currentTables]);
    }
  }

  // Remove a table from the selected list
  removeSelectedTable(table: string): void {
    const currentTables = this.selectedTablesSubject.getValue();
    this.selectedTablesSubject.next(currentTables.filter(t => t !== table));
  }

  setActiveTab(tab: string) {
    this.activeTabSubject.next(tab);
  }


}
