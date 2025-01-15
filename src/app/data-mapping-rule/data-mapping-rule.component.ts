import { ChangeDetectorRef, Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabService } from '../tab.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { firstValueFrom } from 'rxjs';

export interface MappingRow {
  [key: string]: string | number | boolean | any;
  srNo?: number;
  sourceTable?: string;
  sourceColumn?: string;
  transformation?: string;
  comment?: string;

  fdsTable?: string;
  fdsColumn?: string;
  dataType?: string;
  pk?: string;
  nullable?: string;
  fdsComment?: string;

  fdsStageTable?: string;
  fdsStageColumn?: string;
  stageDataType?: string;
  stagePk?: string;
  stageNullable?: string;
  custom?: string;
  stageComment?: string;
}

@Component({
  selector: 'app-data-mapping-rule',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './data-mapping-rule.component.html',
  styleUrl: './data-mapping-rule.component.css',
})
export class DataMappingRuleComponent {
  activeTab: string = '';
  globalSearchText: string = '';
  globalFilterColumn: string = '';
  isButtonsVisible: boolean = false;
  isColumnActionsVisible: boolean = false;
  columnName: string = '';

  constructor(
    private roleService: RoleService,
    private tabService: TabService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    // this.initNewRow();
  }

  ngOnInit(): void {
    // Subscribe to activeTab$ to receive updates from TabService
    this.tabService.activeTab$.subscribe((tab) => {
      this.activeTab = tab;
    });
  }

  /**
   * Returns the table format for the current tab's tables.
   * @param tableIndex Index of the table (0 for first, 1 for second).
   */
  getTableFormat(tableIndex: number): { header: string; field: string }[] {
    const tabFormats: Record<string, { header: string; field: string }[][]> = {
      'Pre-Stage Table': [
        this.tableFormats['sourceTable'],
        this.tableFormats['fdsPreStageTable'],
      ],
      'Stage Table': [
        this.tableFormats['fdsPreStageTable1'],
        this.tableFormats['fdsStageTable'],
      ],
      'ID TP Table': [
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
      'Pre-Stage Table': [
        this.mappingRules['sourceTable'],
        this.mappingRules['fdsPreStageTable'],
      ],
      'Stage Table': [
        this.mappingRules['fdsPreStageTable1'],
        this.mappingRules['fdsStageTable'],
      ],
      'ID TP Table': [
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
      'Pre-Stage Table': ['Source Table', 'FDS Pre-Stage Table'],
      'Stage Table': ['FDS Pre-Stage Table', 'FDS Stage Table'],
      'ID TP Table': ['Source Table', 'ID TP Table'],
    };

    return tabHeaders[this.activeTab]?.[tableIndex] || 'Table';
  }

  /**
 * Returns the headers of the tables for the active tab.
 */
getActiveTabTableHeaders(): string[] {
  const tabHeaders: Record<string, string[]> = {
    'Pre-Stage Table': ['Source Table', 'FDS Pre-Stage Table'],
    'Stage Table': ['FDS Pre-Stage Table', 'FDS Stage Table'],
    'ID TP Table': ['Source Table', 'ID TP Table'],
  };

  return tabHeaders[this.activeTab] || [];
}

/**
 * Returns the mapping rules for the specified table header in the active tab.
 * @param tableHeader Header of the table.
 */
getMappingRulesByHeader(tableHeader: string): MappingRow[] {
  const tabRules: Record<string, Record<string, MappingRow[]>> = {
    'Pre-Stage Table': {
      'Source Table': this.mappingRules['sourceTable'],
      'FDS Pre-Stage Table': this.mappingRules['fdsPreStageTable'],
    },
    'Stage Table': {
      'FDS Pre-Stage Table': this.mappingRules['fdsPreStageTable1'],
      'FDS Stage Table': this.mappingRules['fdsStageTable'],
    },
    'ID TP Table': {
      'Source Table': this.mappingRules['fdsgenerated'],
      'ID TP Table': this.mappingRules['tpMapTable'],
    },
  };

  return tabRules[this.activeTab]?.[tableHeader] || [];
}

  // tabs = [
  //   'Source to FDS Pre-Stage Mapping Table',
  //   'FDS Pre-Stage to FDS Stage Mapping Table',
  //   'FDS Generated ID TP Mapping Table',
  // ];

  tabs = ['Pre-Stage Table', 'Stage Table', 'ID TP Table'];

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

  openDialog(message: string, title: string = 'Notification') {
    this.dialog.open(DialogComponent, {
      data: { title: title, message: message },
    });
  }

  async openInputDialog(
    title: string,
    message: string,
    inputLabel: string = '',
    inputValue: string = '',
    selectLabel: string = '',
    options: string[] = [],
    selectedOption: string = ''
  ): Promise<string | null> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title,
        message,
        input: !!inputLabel,
        inputLabel,
        inputValue,
        selectLabel,
        options,
        selectedOption,
      },
    });

    // return dialogRef.afterClosed().toPromise();
    return firstValueFrom(dialogRef.afterClosed());
  }

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

  async addMap() {
    if (!this.isAdmin()) return;
    const tableChoice = await this.openInputDialog(
      'Select Table',
      'For which table do you want to add a new row?',
      '',
      '',
      'Select Table:',
      this.getActiveTabTableHeaders(), // Fetches the headers of the active tab's tables
      this.getActiveTabTableHeaders()[0] // Default selection is the first table's header
    );

    if (!tableChoice) return;

    const insertOption = await this.openInputDialog(
      'Insert Row',
      `Where do you want to insert a new row in "${tableChoice}"?`,
      '',
      '',
      'Select Option:',
      ['At the Beginning', 'At the End', 'In Between'],
      'At the Beginning'
    );

    if (!insertOption) return;

    const newRow: MappingRow = {
      srNo: this.getMappingRulesByHeader(tableChoice).length + 1,
      sourceTable: 'New Source Table',
      sourceColumn: 'New Source Column',
      transformation: 'New Transformation',
      comment: 'New Comment',
      fdsTable: 'New FDS Table',
      fdsColumn: 'New FDS Column',
      dataType: 'New Data Type',
      pk: 'No',
      nullable: 'Yes',
      fdsComment: 'New Comment',
      fdsStageTable: 'New FDS Stage Table',
      fdsStageColumn: 'New FDS Stage Column',
      stageDataType: 'New Stage Data Type',
      stagePk: 'No',
      stageNullable: 'Yes',
      custom: 'Custom Value',
      stageComment: 'New Stage Comment',
    };

    const tableData = this.getMappingRulesByHeader(tableChoice);

    switch (insertOption.trim()) {
      case 'At the Beginning': {
        tableData.unshift(newRow);
        this.openDialog(`New row added at the beginning of "${tableChoice}"! You can now edit it.`);
        break;
      }

      case 'At the End': {
        tableData.push(newRow);
        this.openDialog(`New row added at the end of "${tableChoice}"! You can now edit it.`);
        break;
      }

      case 'In Between': {
        const position = await this.openInputDialog(
          'Select Position',
          `Enter the position (1 to ${tableData.length}) where you want to insert a new row in "${tableChoice}":`,
          'Position',
          ''
        );

        if (position) {
          const index = Number(position) - 1;
          if (index >= 0 && index <= tableData.length) {
            tableData.splice(index, 0, newRow);
            this.openDialog(`New row added at position ${index + 1} in "${tableChoice}"! You can now edit it.`);
          } else {
            this.openDialog('Invalid position!');
          }
        } else {
          return;
        }
        break;
      }

      default:
        this.openDialog('Invalid option!');
        break;
    }

    // Reassign serial numbers
    tableData.forEach((row, index) => {
      row.srNo = index + 1;
    });

    this.cdr.detectChanges();
  }

  editMap() {
    if (!this.isAdmin()) return;
    alert('Edit content clicked!');
  }

  deleteMap() {
    if (!this.isAdmin()) return;
    alert('Delete content clicked!');
  }

  async addColumnMap() {
    if (!this.isAdmin()) return;

    const tableHeaders = this.getActiveTabTableHeaders();

    const tableChoice = await this.openInputDialog(
      'Select Table',
      'For which table do you want to add a new column?',
      '',
      '',
      'Select Table:',
      tableHeaders,
      tableHeaders[0]
    );

    if (!tableChoice) return;

    const columnName = await this.openInputDialog(
      'Enter New Column Name',
      `Enter Name of New Column for "${tableChoice}":`,
      'Column Name',
      ''
    );

    if (!columnName || columnName.trim() === '') {
      this.openDialog('Please Enter Column Name!');
      return;
    }


    const newField = columnName.replace(/\s+/g, '').toLowerCase();
    const tableData = this.getMappingRulesByHeader(tableChoice);
    const tableFormat = this.getTableFormat(tableHeaders.indexOf(tableChoice));

    if (
      tableFormat.some(
        (column) => column.field === newField || column.header === columnName
      )
    ) {
      this.openDialog(`Column "${columnName}" Already Exists in "${tableChoice}"!`);
      return;
    }

    const newColumn = { header: columnName, field: newField };
    tableFormat.push(newColumn);

    tableData.forEach((row) => {
      row[newField] = '';
    });

    this.cdr.detectChanges();

    this.openDialog(`New column "${columnName}" Added to "${tableChoice}" Successfully!`);

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
