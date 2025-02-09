import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  // private selectedTablesSubject = new BehaviorSubject<string[]>([]);
  private selectedTablesSubject = new BehaviorSubject<{ [key: number]: string[] }>({});
  selectedTables$ = this.selectedTablesSubject.asObservable();

  private currentRowIdSubject = new BehaviorSubject<number | null>(null);
  currentRowId$ = this.currentRowIdSubject.asObservable();

  private activeTabSubject = new BehaviorSubject<string>('Pre-Stage Table');
  activeTab$ = this.activeTabSubject.asObservable();

  constructor() { }

  // Update selected tables based on the IndexComponent selection
  // updateSelectedTables(tables: string[]): void {
  //   this.selectedTablesSubject.next(tables);
  // }

  // Add a table to the selected list
  addSelectedTable(table: string, rowId: number): void {
    const currentMapping = this.selectedTablesSubject.getValue();
    const rowTables = currentMapping[rowId] || [];
    if (!rowTables.includes(table)) {
      rowTables.push(table);
    }
    currentMapping[rowId] = rowTables;
    this.selectedTablesSubject.next({ ...currentMapping });
  }

  // Remove a table from the selected list
  removeSelectedTableForRow(table: string, rowId: number): void {
    const currentMapping = this.selectedTablesSubject.getValue();
    const rowTables = currentMapping[rowId] || [];
    currentMapping[rowId] = rowTables.filter(t => t !== table);
    this.selectedTablesSubject.next({ ...currentMapping });
  }

  setCurrentRowId(rowId: number): void {
    this.currentRowIdSubject.next(rowId);
  }

  setActiveTab(tab: string) {
    this.activeTabSubject.next(tab);
  }

}
