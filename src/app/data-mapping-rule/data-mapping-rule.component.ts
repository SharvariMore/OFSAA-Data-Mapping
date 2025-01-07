import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MappingRow {
  [key: string]: any;
}

@Component({
  selector: 'app-data-mapping-rule',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './data-mapping-rule.component.html',
  styleUrl: './data-mapping-rule.component.css',
})
export class DataMappingRuleComponent {
  activeTab: string = 'Source to FDS Pre-Stage Mapping Table';
  globalSearchText: string = '';
  globalFilterColumn: string = '';
  isButtonsVisible: boolean = false;
  isColumnActionsVisible: boolean = false;

  constructor(private roleService: RoleService) {
    // this.initNewRow();
  }

  /**
   * Returns the table format for the current tab's tables.
   * @param tableIndex Index of the table (0 for first, 1 for second).
   */
  getTableFormat(tableIndex: number): { header: string; field: string }[] {
    const tabFormats: Record<string, { header: string; field: string }[][]> = {
      'Source to FDS Pre-Stage Mapping Table': [
        this.tableFormats['sourceTable'],
        this.tableFormats['fdsPreStageTable'],
      ],
      'FDS Pre-Stage to FDS Stage Mapping Table': [
        this.tableFormats['fdsPreStageTable1'],
        this.tableFormats['fdsStageTable'],
      ],
      'FDS Generated ID TP Mapping Table': [
        this.tableFormats['fdsgenerated'],
        this.tableFormats['tpMapTable'],
      ],
    };

    return tabFormats[this.activeTab]?.[tableIndex] || [];
  }

  /**
   * Returns the mapping rules for the current tab's tables.
   * @param tableIndex Index of the table (0 for first, 1 for second).
   */
  getMappingRules(tableIndex: number): MappingRow[] {
    const tabRules: Record<string, MappingRow[][]> = {
      'Source to FDS Pre-Stage Mapping Table': [
        this.mappingRules['sourceTable'],
        this.mappingRules['fdsPreStageTable'],
      ],
      'FDS Pre-Stage to FDS Stage Mapping Table': [
        this.mappingRules['fdsPreStageTable1'],
        this.mappingRules['fdsStageTable'],
      ],
      'FDS Generated ID TP Mapping Table': [
        this.mappingRules['fdsgenerated'],
        this.mappingRules['tpMapTable'],
      ],
    };

    return tabRules[this.activeTab]?.[tableIndex] || [];
  }

  /**
   * Returns the header name for a table based on its index and the active tab.
   * @param tableIndex Index of the table (0 for first, 1 for second).
   */
  getTableHeader(tableIndex: number): string {
    const tabHeaders: Record<string, string[]> = {
      'Source to FDS Pre-Stage Mapping Table': [
        'Source Table',
        'FDS Pre-Stage Table',
      ],
      'FDS Pre-Stage to FDS Stage Mapping Table': [
        'FDS Pre-Stage Table',
        'FDS Stage Table',
      ],
      'FDS Generated ID TP Mapping Table': ['Source Table', 'ID TP Table'],
    };

    return tabHeaders[this.activeTab]?.[tableIndex] || 'Table';
  }

  tabs = [
    'Source to FDS Pre-Stage Mapping Table',
    'FDS Pre-Stage to FDS Stage Mapping Table',
    'FDS Generated ID TP Mapping Table',
  ];

  tableFormats: { [key: string]: Array<{ header: string; field: string }> } = {
    sourceTable: [
      { header: 'Sr. No.', field: 'srNo' },
      { header: 'Source Table', field: 'sourceTable' },
      { header: 'Source Column', field: 'sourceColumn' },
      { header: 'Transformation', field: 'transformation' },
      { header: 'Comment', field: 'comment' },
    ],
    fdsPreStageTable: [
      { header: 'FDS Table', field: 'fdsTable' },
      { header: 'FDS Column', field: 'fdsColumn' },
      { header: 'Data Type', field: 'dataType' },
      { header: 'PK', field: 'pk' },
      { header: 'Nullable', field: 'nullable' },
      { header: 'Comment', field: 'fdsComment' },
    ],
    fdsPreStageTable1: [
      { header: 'FDS Table', field: 'fdsTable' },
      { header: 'FDS Column', field: 'fdsColumn' },
      { header: 'Transformation', field: 'transformation' },
      { header: 'Data Type', field: 'dataType' },
      { header: 'PK', field: 'pk' },
      { header: 'Nullable', field: 'nullable' },
      { header: 'Comment', field: 'fdsComment' },
    ],
    fdsStageTable: [
      { header: 'FDS Stage Table', field: 'fdsStageTable' },
      { header: 'FDS Stage Column', field: 'fdsStageColumn' },
      { header: 'Data Type', field: 'stageDataType' },
      { header: 'PK', field: 'stagePk' },
      { header: 'Nullable', field: 'stageNullable' },
      { header: 'Custom', field: 'custom' },
      { header: 'Comment', field: 'stageComment' },
    ],
    fdsgenerated: [
      { header: 'Sr. No.', field: 'srNo' },
      { header: 'Source Table', field: 'sourceTable' },
      { header: 'Source Column', field: 'sourceColumn' },
      { header: 'Transformation', field: 'transformation' },
      { header: 'Comment', field: 'comment' },
    ],
    tpMapTable: [
      { header: 'FDS Table', field: 'fdsTable' },
      { header: 'FDS Column', field: 'fdsColumn' },
      { header: 'Data Type', field: 'dataType' },
      { header: 'PK', field: 'pk' },
      { header: 'Nullable', field: 'nullable' },
      { header: 'Comment', field: 'fdsComment' },
    ],
  };

  mappingRules: { [key: string]: MappingRow[] } = {
    sourceTable: [
      {
        srNo: 1,
        sourceTable: 'Source1',
        sourceColumn: 'Column1',
        transformation: 'Transform1',
        comment: 'Comment1',
      },
      {
        srNo: 2,
        sourceTable: 'Source2',
        sourceColumn: 'Column2',
        transformation: 'Transform2',
        comment: 'Comment2',
      },
    ],
    fdsPreStageTable: [
      {
        fdsTable: 'FDS_Table1',
        fdsColumn: 'FDS_Column1',
        dataType: 'VARCHAR',
        pk: 'Yes',
        nullable: 'No',
        fdsComment: 'CommentA',
      },
      {
        fdsTable: 'FDS_Table2',
        fdsColumn: 'FDS_Column2',
        dataType: 'INT',
        pk: 'No',
        nullable: 'Yes',
        fdsComment: 'CommentB',
      },
    ],
    fdsPreStageTable1: [
      {
        fdsTable: 'FDS_Table1',
        fdsColumn: 'FDS_Column1',
        transformation: 'Transform2',
        dataType: 'VARCHAR',
        pk: 'Yes',
        nullable: 'No',
        fdsComment: 'CommentB',
      },
      {
        fdsTable: 'FDS_Table2',
        fdsColumn: 'FDS_Column2',
        transformation: 'Transform3',
        dataType: 'INT',
        pk: 'No',
        nullable: 'Yes',
        fdsComment: 'CommentC',
      },
    ],
    fdsStageTable: [
      {
        fdsStageTable: 'Stage_Table1',
        fdsStageColumn: 'Stage_Column1',
        stageDataType: 'NUMBER',
        stagePk: 'No',
        stageNullable: 'Yes',
        custom: 'CustomValue',
        stageComment: 'CommentC',
      },
      {
        fdsStageTable: 'Stage_Table2',
        fdsStageColumn: 'Stage_Column2',
        stageDataType: 'VARCHAR',
        stagePk: 'Yes',
        stageNullable: 'No',
        custom: 'CustomValue2',
        stageComment: 'CommentD',
      },
    ],
    fdsgenerated: [
      {
        srNo: 1,
        sourceTable: 'SourceID1',
        sourceColumn: 'ID_Column1',
        transformation: 'Transform3',
        comment: 'CommentD',
      },
      {
        srNo: 2,
        sourceTable: 'SourceID2',
        sourceColumn: 'ID_Column2',
        transformation: 'Transform4',
        comment: 'CommentE',
      },
    ],
    tpMapTable: [
      {
        fdsTable: 'ID_Table1',
        fdsColumn: 'ID_Column1',
        dataType: 'INT',
        pk: 'No',
        nullable: 'Yes',
        fdsComment: 'CommentF',
      },
      {
        fdsTable: 'ID_Table2',
        fdsColumn: 'ID_Column2',
        dataType: 'VARCHAR',
        pk: 'Yes',
        nullable: 'No',
        fdsComment: 'CommentG',
      },
    ],
  };

  isAdmin(): boolean {
    return this.roleService.getRole() === 'Admin';
  }

  newMappingRow: MappingRow = {};

  // initNewRow() {
  //   const format = this.tableFormats[this.activeTab];
  //   this.newMappingRow = {};
  //   format.forEach(column => {
  //     this.newMappingRow[column.replace(/\s+/g, '').toLowerCase()] = '';
  //   });
  // }

  switchTab(tab: string) {
    if (!this.tabs.includes(tab)) {
      console.warn(`Invalid tab: ${tab}`);
      return;
    }
    this.activeTab = tab;
    // this.initNewRow();
  }

  getRowValue(row: any, column: { header: string; field: string }): string {
    const propertyName = column.field;
    return row[propertyName] || '';
  }

  filteredData(tableIndex: number): any[] {
    const searchText = this.globalSearchText?.toLowerCase().trim();
    const filterColumn = this.globalFilterColumn;
    const data = this.getMappingRules(tableIndex);

    if (!searchText) return data;

    // const data = this.mappingRules[Object.keys(this.mappingRules)[tableIndex]];

    return data.filter((row) => {
      if (filterColumn) {
        return this.matchText(row[filterColumn], searchText);
      } else {
        return Object.values(row).some((val) =>
          this.matchText(val, searchText)
        );
      }
    });
  }

  matchText(value: any, searchText: string): boolean {
    if (value && searchText) {
      return value.toString().toLowerCase().includes(searchText.toLowerCase());
    } else {
      return false;
    }
  }

  isEllipsisActive(element: HTMLElement | null): boolean {
    if (!element) return false;
    return element.offsetWidth < element.scrollWidth;
  }

  addMap() {
    if (!this.isAdmin()) return;
    alert('Add content clicked!');
  }

  editMap() {
    if (!this.isAdmin()) return;
    alert('Edit content clicked!');
  }

  deleteMap() {
    if (!this.isAdmin()) return;
    alert('Delete content clicked!');
  }

  addColumnMap() {
    if (!this.isAdmin()) return;
    alert('Add content clicked!');
  }

  editColumnMap() {
    if (!this.isAdmin()) return;
    alert('Edit content clicked!');
  }

  deleteColumnMap() {
    if (!this.isAdmin()) return;
    alert('Add content clicked!');
  }

  saveMap() {
    if (!this.isAdmin()) return;
    alert('Save content clicked!');
  }

  undoDeleteColumnMap() {
    if (!this.isAdmin()) return;
    alert('Undo content clicked!');
  }

  exportToExcel() {
    alert('Exporting data to Excel...');
  }

  toggleButtonsVisibility() {
    this.isButtonsVisible = !this.isButtonsVisible;
  }

  toggleColumnActionsVisibility() {
    this.isColumnActionsVisible = !this.isColumnActionsVisible;
  }
}
