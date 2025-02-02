import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabService } from '../tab.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableRow } from '../index/index.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  tableColumns?: string[];
}

@Component({
  selector: 'app-data-mapping-rule',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, NgxPaginationModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  templateUrl: './data-mapping-rule.component.html',
  styleUrl: './data-mapping-rule.component.css',
})
export class DataMappingRuleComponent implements OnInit {
  activeTab: string = '';
  globalSearchText: string = '';
  globalFilterColumn: string = '';
  ruleSearchText: string = '';
  isButtonsVisible: boolean = false;
  isColumnActionsVisible: boolean = false;
  columnName: string = '';
  isEditing: boolean = false;
  editingRow: MappingRow | null = null;
  // ofsaaPhysicalNames: string | null = null;
  ofsaaPhysicalNamesList: string[] = [];
  selectedOfsaaPhysicalNames?: string;
  // selectedTableIndex: number = -1; // Keeps track of the selected table (0 or 1)
  // selectedRowIndex: number = -1; // Keeps track of the selected row index
  // editingRow: { [tableIndex: number]: MappingRow | null } = { 0: null, 1: null };
  currentPage = 1;
  itemsPerPage = 10;
  paginatedData: MappingRow[] = [];

  constructor(
    private roleService: RoleService,
    private tabService: TabService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    // this.initNewRow();
  }

  ngOnInit(): void {
    // Subscribe to activeTab$ to receive updates from TabService
    this.tabService.activeTab$.subscribe((tab) => {
      this.activeTab = tab;
    });

    // this.route.queryParams.subscribe((params) => {
    //   this.ofsaaPhysicalNames = params['ofsaaPhysicalNames'];
    // });
    this.route.queryParams.subscribe(params => {
      this.selectedOfsaaPhysicalNames = params['ofsaaPhysicalNames'];

      const ofsaaPhysicalNamesListStr = params['ofsaaPhysicalNamesList'];
      if (ofsaaPhysicalNamesListStr) {
        this.ofsaaPhysicalNamesList = JSON.parse(ofsaaPhysicalNamesListStr);
      }
    });
  }

  get filteredOfsaaPhysicalNames(): string[] {
    if (!this.ruleSearchText) {
      return this.ofsaaPhysicalNamesList;
    }
    return this.ofsaaPhysicalNamesList.filter(name =>
      name.toLowerCase().includes(this.ruleSearchText.toLowerCase())
    );
  }

  onSelectOfsaaPhysicalName(name: string): void {
    this.selectedOfsaaPhysicalNames = name;
  }

  sourceTable: TableRow[] = [];  // Source table array to store rows
  preStageTable: TableRow[] = [];  // Pre-stage table array to store rows
  stageTable: TableRow[] = [];  // Stage table array to store rows
  idTpTable: TableRow[] = [];  // ID TP table array to store rows

  /**
   * Returns the table format for the current tab's tables.
   * @param tableIndex Index of the table (0 for first, 1 for second).
   */
  // getTableFormat(tableIndex: number): { header: string; field: string }[] {
  //   const tabFormats: Record<string, { header: string; field: string }[][]> = {
  //     'Pre-Stage Table': [
  //       this.tableFormats['sourceTable'],
  //       this.tableFormats['fdsPreStageTable'],
  //     ],
  //     'Stage Table': [
  //       this.tableFormats['fdsPreStageTable1'],
  //       this.tableFormats['fdsStageTable'],
  //     ],
  //     'ID TP Table': [
  //       this.tableFormats['fdsgenerated'],
  //       this.tableFormats['tpMapTable'],
  //     ],
  //   };

  //   return tabFormats[this.activeTab]?.[tableIndex] || [];
  // }
  getTableFormat(tableIndex: number): { header: string; field: string }[] {
    const tabFormats: Record<string, { header: string; field: string }[]> = {
      'Source Table': this.tableFormats['sourceTable'],
      'Pre-Stage Table': this.tableFormats['fdsPreStageTable'],
      'Stage Table': this.tableFormats['fdsStageTable'],
      'ID TP Table': this.tableFormats['tpMapTable'],
    };

    return tabFormats[this.activeTab] || [];
  }

  /**
   * Returns the mapping rules for the current tab's tables.
   * @param tableIndex Index of the table (0 for first, 1 for second).
   */
  // getMappingRules(tableIndex: number): MappingRow[] {
  //   const tabRules: Record<string, MappingRow[][]> = {
  //     'Pre-Stage Table': [
  //       this.mappingRules['sourceTable'],
  //       this.mappingRules['fdsPreStageTable'],
  //     ],
  //     'Stage Table': [
  //       this.mappingRules['fdsPreStageTable1'],
  //       this.mappingRules['fdsStageTable'],
  //     ],
  //     'ID TP Table': [
  //       this.mappingRules['fdsgenerated'],
  //       this.mappingRules['tpMapTable'],
  //     ],
  //   };

  //   return tabRules[this.activeTab]?.[tableIndex] || [];
  // }
  getMappingRules(tableIndex: number): MappingRow[] {
    const tabRules: Record<string, MappingRow[]> = {
      'Source Table': this.mappingRules['sourceTable'],
      'Pre-Stage Table': this.mappingRules['fdsPreStageTable'],
      'Stage Table': this.mappingRules['fdsStageTable'],
      'ID TP Table': this.mappingRules['tpMapTable'],
    };

    return tabRules[this.activeTab] || [];
  }

  /**
   * Returns the header name for a table based on its index and the active tab.
   * @param tableIndex Index of the table (0 for first, 1 for second).
   */
//  getTableHeader(tableIndex: number): string {
//     const tabHeaders: Record<string, string[]> = {
//       'Pre-Stage Table': ['Source Table', 'FDS Pre-Stage Table'],
//       'Stage Table': ['FDS Pre-Stage Table', 'FDS Stage Table'],
//       'ID TP Table': ['Source Table', 'ID TP Table'],
//     };

//     return tabHeaders[this.activeTab]?.[tableIndex] || 'Table';
//   }

getTableHeader(tableIndex: number): string {
  const tabHeaders: Record<string, string[]> = {
    'Source Table': ['Source Table'],
    'Pre-Stage Table': ['FDS Pre-Stage Table'],
    'Stage Table': ['FDS Stage Table'],
    'ID TP Table': ['ID TP Table'],
  };

  return tabHeaders[this.activeTab]?.[tableIndex] || 'Table';
}
  /**
   * Returns the headers of the tables for the active tab.
   */
  // getActiveTabTableHeaders(): string[] {
  //   const tabHeaders: Record<string, string[]> = {
  //     'Pre-Stage Table': ['Source Table', 'FDS Pre-Stage Table'],
  //     'Stage Table': ['FDS Pre-Stage Table', 'FDS Stage Table'],
  //     'ID TP Table': ['Source Table', 'ID TP Table'],
  //   };

  //   return tabHeaders[this.activeTab] || [];
  // }

  getActiveTabTableHeaders(): string[] {
    const tabHeaders: Record<string, string[]> = {
      'Source Table': ['Source Table'],  // Only Source Table header
      'Pre-Stage Table': ['FDS Pre-Stage Table'],  // Only Pre-Stage Table header
      'Stage Table': ['FDS Stage Table'],  // Only Stage Table header
      'ID TP Table': ['ID TP Table'],  // Only ID TP Table header
    };

    return tabHeaders[this.activeTab] || [];
  }

  /**
   * Returns the mapping rules for the specified table header in the active tab.
   * @param tableHeader Header of the table.
   */
  // getMappingRulesByHeader(tableHeader: string): MappingRow[] {
  //   const tabRules: Record<string, Record<string, MappingRow[]>> = {
  //     'Pre-Stage Table': {
  //       'Source Table': this.mappingRules['sourceTable'],
  //       'FDS Pre-Stage Table': this.mappingRules['fdsPreStageTable'],
  //     },
  //     'Stage Table': {
  //       'FDS Pre-Stage Table': this.mappingRules['fdsPreStageTable1'],
  //       'FDS Stage Table': this.mappingRules['fdsStageTable'],
  //     },
  //     'ID TP Table': {
  //       'Source Table': this.mappingRules['fdsgenerated'],
  //       'ID TP Table': this.mappingRules['tpMapTable'],
  //     },
  //   };

  //   return tabRules[this.activeTab]?.[tableHeader] || [];
  // }
  getMappingRulesByHeader(tableHeader: string): MappingRow[] {
    const tabRules: Record<string, Record<string, MappingRow[]>> = {
      'Source Table': {
        'Source Table': this.mappingRules['sourceTable'],  // Show mapping rules only for Source Table
      },
      'Pre-Stage Table': {
        'FDS Pre-Stage Table': this.mappingRules['fdsPreStageTable'],  // Show mapping rules only for Pre-Stage Table
      },
      'Stage Table': {
        'FDS Stage Table': this.mappingRules['fdsStageTable'],  // Show mapping rules only for Stage Table
      },
      'ID TP Table': {
        'ID TP Table': this.mappingRules['tpMapTable'],  // Show mapping rules only for ID TP Table
      },
    };

    return tabRules[this.activeTab]?.[tableHeader] || [];
  }


  /**
   * Updates the `srNo` for rows in a given table header.
   * @param tableHeader Header of the table to update `srNo`.
   */
  updateSrNo(tableHeader: string) {
    const tableData = this.getMappingRulesByHeader(tableHeader);
    tableData.forEach((row, index) => {
      row.srNo = index + 1;
    });
  }

  // tabs = [
  //   'Source to FDS Pre-Stage Mapping Table',
  //   'FDS Pre-Stage to FDS Stage Mapping Table',
  //   'FDS Generated ID TP Mapping Table',
  // ];

  tabs = ['Source Table', 'Pre-Stage Table', 'Stage Table', 'ID TP Table'];

  // tableFormats: { [key: string]: Array<{ header: string; field: string }> } = {
  //   sourceTable: [
  //     { header: 'Sr. No.', field: 'srNo' },
  //     { header: 'Source Table', field: 'sourceTable' },
  //     { header: 'Source Column', field: 'sourceColumn' },
  //     { header: 'Transformation', field: 'transformation' },
  //     { header: 'Comment', field: 'comment' },
  //   ],
  //   fdsPreStageTable: [
  //     { header: 'FDS Table', field: 'fdsTable' },
  //     { header: 'FDS Column', field: 'fdsColumn' },
  //     { header: 'Data Type', field: 'dataType' },
  //     { header: 'PK', field: 'pk' },
  //     { header: 'Nullable', field: 'nullable' },
  //     { header: 'Comment', field: 'fdsComment' },
  //   ],
  //   fdsPreStageTable1: [
  //     { header: 'FDS Table', field: 'fdsTable' },
  //     { header: 'FDS Column', field: 'fdsColumn' },
  //     { header: 'Transformation', field: 'transformation' },
  //     { header: 'Data Type', field: 'dataType' },
  //     { header: 'PK', field: 'pk' },
  //     { header: 'Nullable', field: 'nullable' },
  //     { header: 'Comment', field: 'fdsComment' },
  //   ],
  //   fdsStageTable: [
  //     { header: 'FDS Stage Table', field: 'fdsStageTable' },
  //     { header: 'FDS Stage Column', field: 'fdsStageColumn' },
  //     { header: 'Data Type', field: 'stageDataType' },
  //     { header: 'PK', field: 'stagePk' },
  //     { header: 'Nullable', field: 'stageNullable' },
  //     { header: 'Custom', field: 'custom' },
  //     { header: 'Comment', field: 'stageComment' },
  //   ],
  //   fdsgenerated: [
  //     { header: 'Sr. No.', field: 'srNo' },
  //     { header: 'Source Table', field: 'sourceTable' },
  //     { header: 'Source Column', field: 'sourceColumn' },
  //     { header: 'Transformation', field: 'transformation' },
  //     { header: 'Comment', field: 'comment' },
  //   ],
  //   tpMapTable: [
  //     { header: 'FDS Table', field: 'fdsTable' },
  //     { header: 'FDS Column', field: 'fdsColumn' },
  //     { header: 'Data Type', field: 'dataType' },
  //     { header: 'PK', field: 'pk' },
  //     { header: 'Nullable', field: 'nullable' },
  //     { header: 'Comment', field: 'fdsComment' },
  //   ],
  // };

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
    fdsStageTable: [
      { header: 'FDS Stage Table', field: 'fdsStageTable' },
      { header: 'FDS Stage Column', field: 'fdsStageColumn' },
      { header: 'Data Type', field: 'stageDataType' },
      { header: 'PK', field: 'stagePk' },
      { header: 'Nullable', field: 'stageNullable' },
      { header: 'Custom', field: 'custom' },
      { header: 'Comment', field: 'stageComment' },
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

  //
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
        srNo: 1,
        fdsTable: 'FDS_Table1',
        fdsColumn: 'FDS_Column1',
        dataType: 'VARCHAR',
        pk: 'Yes',
        nullable: 'No',
        fdsComment: 'CommentA',
      },
      {
        srNo: 2,
        fdsTable: 'FDS_Table2',
        fdsColumn: 'FDS_Column2',
        dataType: 'INT',
        pk: 'No',
        nullable: 'Yes',
        fdsComment: 'CommentB',
      },
    ],
    fdsStageTable: [
      {
        srNo: 1,
        fdsStageTable: 'Stage_Table1',
        fdsStageColumn: 'Stage_Column1',
        stageDataType: 'NUMBER',
        stagePk: 'No',
        stageNullable: 'Yes',
        custom: 'CustomValue',
        stageComment: 'CommentC',
      },
      {
        srNo: 2,
        fdsStageTable: 'Stage_Table2',
        fdsStageColumn: 'Stage_Column2',
        stageDataType: 'VARCHAR',
        stagePk: 'Yes',
        stageNullable: 'No',
        custom: 'CustomValue2',
        stageComment: 'CommentD',
      },
    ],
    tpMapTable: [
      {
        srNo: 1,
        fdsTable: 'ID_Table1',
        fdsColumn: 'ID_Column1',
        dataType: 'INT',
        pk: 'No',
        nullable: 'Yes',
        fdsComment: 'CommentF',
      },
      {
        srNo: 2,
        fdsTable: 'ID_Table2',
        fdsColumn: 'ID_Column2',
        dataType: 'VARCHAR',
        pk: 'Yes',
        nullable: 'No',
        fdsComment: 'CommentG',
      },
    ],
  };

  insertIntoSourceTable(newRow: TableRow): void {
    console.log('Inserting into Source Table:', newRow);
    this.sourceTable.push(newRow);
  }

  // Method to handle insertion into the Pre-Stage Table
  insertIntoPreStageTable(newRow: TableRow): void {
    console.log('Inserting into Pre-Stage Table:', newRow);
    this.preStageTable.push(newRow);
  }

  // Method to handle insertion into the Stage Table
  insertIntoStageTable(newRow: TableRow): void {
    console.log('Inserting into Stage Table:', newRow);
    this.stageTable.push(newRow);
  }

  // Method to handle insertion into the ID TP Table
  insertIntoIdTpTable(newRow: TableRow): void {
    console.log('Inserting into ID TP Table:', newRow);
    this.idTpTable.push(newRow);
  }


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

    const insertOption = await this.openInputDialog(
      'Insert Row',
      'Where do you want to insert a new row in both tables?',
      '',
      '',
      'Select Option:',
      ['At the Beginning', 'At the End', 'In Between'],
      'At the Beginning'
    );

    if (!insertOption) return;

    const newRow: MappingRow = {
      srNo: 1,
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

    const tableData1 = this.getMappingRulesByHeader(this.getTableHeader(0));
    const tableData2 = this.getMappingRulesByHeader(this.getTableHeader(1));

    switch (insertOption.trim()) {
      case 'At the Beginning': {
        tableData1.unshift(newRow);
        tableData2.unshift(newRow);
        this.openDialog(
          `New row added at the beginning of both tables! You can now edit it.`
        );
        break;
      }

      case 'At the End': {
        tableData1.push(newRow);
        tableData2.push(newRow);
        this.openDialog(
          `New row added at the end of both tables! You can now edit it.`
        );
        break;
      }

      case 'In Between': {
        const position = await this.openInputDialog(
          'Select Position',
          `Enter the position (1 to ${tableData1.length}) where you want to insert a new row in both tables:`,
          'Position',
          ''
        );

        if (position) {
          const index = Number(position) - 1;
          if (index >= 0 && index <= tableData1.length) {
            tableData1.splice(index, 0, newRow);
            tableData2.splice(index, 0, newRow);
            this.openDialog(
              `New row added at position ${
                index + 1
              } in both tables! You can now edit it.`
            );
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

    [tableData1, tableData2].forEach((tableData) => {
      tableData.forEach((row, index) => {
        row.srNo = index + 1;
      });
    });

    this.cdr.detectChanges();
  }

  // selectRow(tableIndex: number, rowIndex: number): void {
  //   this.selectedTableIndex = tableIndex;
  //   this.selectedRowIndex = rowIndex;
  // }

  editMap() {
    if (!this.isAdmin()) return;

    this.isEditing = !this.isEditing;

    if (!this.isEditing) {
      this.saveMap();
    }
  }

  editRow(row: MappingRow): void {
    if (!this.isAdmin()) return;

    if (this.editingRow === row) {
      this.editingRow = null;
      this.openDialog('Edited Data Successfully!');
    } else {
      this.editingRow = row;
    }
  }

  async deleteMap() {
    if (!this.isAdmin()) return;

    const deleteOption = await this.openInputDialog(
      'Delete Row Data',
      'Choose an option for Deletion across both tables:',
      '',
      '',
      'Select Any Option',
      [
        'Delete a specific row',
        'Delete a range of rows',
        'Delete multiple rows',
        'Delete all rows',
      ],
      'Delete a specific row'
    );

    if (!deleteOption) return;

    const headers = this.getActiveTabTableHeaders();

    switch (deleteOption.trim()) {
      case 'Delete a specific row': {
        const rowNum = await this.openInputDialog(
          'Select Position',
          'Enter the Row Number you want to Delete: ',
          'Row Number',
          ''
        );
        if (rowNum) {
          headers.forEach((header) => {
            const tableData = this.getMappingRulesByHeader(header);
            const rowIndex = tableData.findIndex(
              (row) => row.srNo === Number(rowNum)
            );

            if (rowIndex !== -1) {
              tableData.splice(rowIndex, 1);
              this.updateSrNo(header); // Update Sr. No after deletion
              this.cdr.detectChanges();
            }
          });
          this.openDialog(
            `Row ${rowNum} Deleted Successfully from both tables!`
          );
        } else {
          this.openDialog('Row Number Not Found!');
        }
        break;
      }

      case 'Delete a range of rows': {
        const rangeInput = await this.openInputDialog(
          'Select Range',
          'Enter the Starting and Ending Row Numbers (separated by hyphen [-] ):',
          'Range',
          ''
        );
        if (rangeInput) {
          const [startRowNum, endRowNum] = rangeInput
            .split('-')
            .map((num) => Number(num.trim()));

          if (startRowNum <= endRowNum) {
            headers.forEach((header) => {
              const tableData = this.getMappingRulesByHeader(header);
              const startIndex = tableData.findIndex(
                (row) => row.srNo === startRowNum
              );
              const endIndex = tableData.findIndex(
                (row) => row.srNo === endRowNum
              );

              if (
                startIndex !== -1 &&
                endIndex !== -1 &&
                startIndex <= endIndex
              ) {
                tableData.splice(startIndex, endIndex - startIndex + 1);
                this.updateSrNo(header); // Update Sr. No after deletion
                this.cdr.detectChanges();
              }
            });
            this.openDialog(
              `Rows ${startRowNum} to ${endRowNum} Deleted Successfully from both tables!`
            );
          } else {
            this.openDialog('Invalid Range of Row Numbers!');
          }
        }
        break;
      }

      case 'Delete multiple rows': {
        const rowsInput = await this.openInputDialog(
          'Delete Multiple Rows',
          'Enter the Row Numbers you want to Delete, separated by commas(,):',
          'Row Numbers',
          ''
        );
        if (rowsInput) {
          const rowNumbers = rowsInput
            .split(',')
            .map((num) => Number(num.trim()));

          headers.forEach((header) => {
            const tableData = this.getMappingRulesByHeader(header);
            const invalidRows = rowNumbers.filter(
              (num) => !tableData.some((row) => row.srNo === num)
            );

            if (invalidRows.length > 0) {
              this.openDialog(
                `Row numbers not found in ${header}: ${invalidRows.join(', ')}`
              );
            } else {
              this.mappingRules[header] = [
                ...tableData.filter(
                  (row) => !rowNumbers.includes(Number(row.srNo))
                ),
              ];
              this.updateSrNo(header);
              this.cdr.detectChanges();
            }
          });

          this.openDialog(
            `Rows ${rowNumbers.join(', ')} Deleted Successfully!`
          );
        }
        break;
      }

      case 'Delete all rows': {
        const confirmAllDelete = await this.openInputDialog(
          'Delete Confirmation',
          'Are you sure you want to delete all rows from both tables? This action cannot be undone.',
          '',
          '',
          '',
          []
        );
        if (confirmAllDelete) {
          headers.forEach((header) => {
            this.mappingRules[header] = [];
          });
          this.cdr.detectChanges();
          this.openDialog('All Rows Deleted Successfully from both tables!');
        }
        break;
      }

      default:
        this.openDialog('Invalid option!');
        break;
    }
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
      this.openDialog(
        `Column "${columnName}" Already Exists in "${tableChoice}"!`
      );
      return;
    }

    const newColumn = { header: columnName, field: newField };
    tableFormat.push(newColumn);

    tableData.forEach((row) => {
      row[newField] = '';
    });

    this.cdr.detectChanges();

    this.openDialog(
      `New column "${columnName}" Added to "${tableChoice}" Successfully!`
    );
  }

  async editColumnMap() {
    if (!this.isAdmin()) return;

    const tableChoice = await this.openInputDialog(
      'Select Table',
      'In which table do you want to edit a row?',
      '',
      '',
      'Select Table:',
      this.getActiveTabTableHeaders(),
      this.getActiveTabTableHeaders()[0]
    );

    if (!tableChoice) return;

    const selectedTable = this.getMappingRulesByHeader(tableChoice);

    if (!selectedTable.length) {
      this.openDialog(
        `The selected table "${tableChoice}" has no rows to edit.`
      );
      return;
    }

    const editOption = await this.openInputDialog(
      'Select Editing Option',
      `Choose an option for Editing rows in "${tableChoice}":`,
      '',
      '',
      'Select Any Option:',
      ['Edit a Specific Row', 'Edit a Series of Rows'],
      'Edit a Specific Row'
    );

    if (!editOption) return;

    const columnToEdit = await this.openInputDialog(
      'Edit Column',
      `Enter Column Name to edit in "${tableChoice}" table:`,
      'Header Name',
      ''
    );

    if (!columnToEdit) return;

    const selectedColumn = this.getTableFormat(
      this.getActiveTabTableHeaders().indexOf(tableChoice)
    ).find((col) => col.header.toLowerCase() === columnToEdit.toLowerCase());

    if (!selectedColumn) {
      this.openDialog('Invalid Column Name!');
      return;
    }

    switch (editOption.trim()) {
      case 'Edit a Specific Row': {
        const newValue = await this.openInputDialog(
          'Enter New Value',
          `Enter new value for "${selectedColumn.header}" column across all rows:`,
          'Value',
          ''
        );

        if (newValue != null) {
          selectedTable.forEach((row) => {
            row[selectedColumn.field] = newValue;
          });

          this.openDialog(
            `All rows in "${selectedColumn.header}" column of "${tableChoice}" table have been updated to: ${newValue}.`
          );
          this.cdr.detectChanges();
        }
        break;
      }

      case 'Edit a Series of Rows': {
        const rangeInput = await this.openInputDialog(
          'Enter Row Range',
          `Enter the Starting and Ending Row Numbers (separated by a hyphen [-]) in "${tableChoice}" table:`,
          'Row Range',
          ''
        );

        if (!rangeInput || !/^\d+-\d+$/.test(rangeInput)) {
          this.openDialog('Invalid Row Range!');
          return;
        }

        const [start, end] = rangeInput
          .split('-')
          .map((n) => parseInt(n.trim(), 10));
        if (start > end || start < 1 || end > selectedTable.length) {
          this.openDialog('Invalid Row Range!');
          return;
        }

        const newValue = await this.openInputDialog(
          'Enter New Value',
          `Enter new value for rows ${start}-${end} in the "${selectedColumn.header}" column:`,
          'Value',
          ''
        );

        if (newValue != null) {
          for (let i = start - 1; i < end; i++) {
            selectedTable[i][selectedColumn.field] = newValue;
          }

          this.openDialog(
            `Rows ${start}-${end} in the "${selectedColumn.header}" column of "${tableChoice}" table have been updated to: ${newValue}.`
          );
          this.cdr.detectChanges();
        }
        break;
      }

      default:
        this.openDialog('Invalid option!');
        break;
    }
  }

  async deleteColumnMap() {
    if (!this.isAdmin()) return;

    const tableChoice = await this.openInputDialog(
      'Select Table',
      'Which table do you want to delete columns from?',
      '',
      '',
      'Select Table:',
      this.getActiveTabTableHeaders(), // Get headers of the active tab's tables
      this.getActiveTabTableHeaders()[0] // Default to first table
    );

    if (!tableChoice) return;

    const deleteOption = await this.openInputDialog(
      'Delete Column',
      'Choose an option for column Deletion:',
      '',
      '',
      'Select Any Option',
      [
        'Delete a Specific Column',
        'Delete a Range of Columns',
        'Delete Multiple Columns',
      ],
      'Delete a Specific Column'
    );

    if (!deleteOption) return;

    let tableColumns = this.getTableFormat(
      this.getActiveTabTableHeaders().indexOf(tableChoice)
    );

    this.mappingRules = this.mappingRules || {};
    this.mappingRules[tableChoice] =
      this.mappingRules[tableChoice] || [];

    switch (deleteOption.trim()) {
      case 'Delete a Specific Column': {
        // Prompt user to enter the column name
        const colName = await this.openInputDialog(
          'Select Column to Delete',
          'Enter the exact Header Name of the Column you want to Delete:',
          'Column Name',
          ''
        );

        if (colName) {
          const columnIndex = tableColumns.findIndex(
            (col: { header: string }) =>
              col.header.toLowerCase() === colName.toLowerCase()
          );

          if (columnIndex !== -1) {
            const columnField = tableColumns[columnIndex].field;

            tableColumns.splice(columnIndex, 1);
            this.mappingRules[tableChoice].forEach((row: MappingRow) => {
              delete row[columnField];
            });

            this.cdr.detectChanges();
            this.openDialog(
              `Column "${colName}" deleted successfully from ${tableChoice}`
            );
          } else {
            this.openDialog('Invalid Column!');
          }
        }
        break;
      }

      case 'Delete a Range of Columns': {
        const rangeInput = await this.openInputDialog(
          'Select Range',
          'Enter the Starting and Ending column headers (separated by hyphen [-]) to Delete:',
          'Range',
          ''
        );

        if (rangeInput) {
          const [startColumn, endColumn] = rangeInput
            .split('-')
            .map((col) => col.trim());

          const startIndex = tableColumns.findIndex(
            (col: { header: string }) =>
              col.header.toLowerCase() === startColumn.toLowerCase()
          );
          const endIndex = tableColumns.findIndex(
            (col: { header: string }) =>
              col.header.toLowerCase() === endColumn.toLowerCase()
          );

          if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
            const columnsToDelete = tableColumns
              .splice(startIndex, endIndex - startIndex + 1)
              .map((col: { field: any }) => col.field);

            this.mappingRules[tableChoice].forEach((row: MappingRow) => {
              columnsToDelete.forEach(
                (field: string | number) => delete row[field]
              );
            });
            this.cdr.detectChanges();
            this.openDialog(
              `Columns from "${startColumn}" to "${endColumn}" Deleted Successfully From ${tableChoice}`
            );
          } else {
            this.openDialog('Invalid Range of Columns!');
          }
        }
        break;
      }

      case 'Delete Multiple Columns': {
        const columnsInput = await this.openInputDialog(
          'Select Multiple Columns',
          'Enter the Column Headers separated by comma (,) to Delete:',
          'Columns',
          ''
        );

        if (columnsInput) {
          const columnsToDelete = columnsInput
            .split(',')
            .map((col) => col.trim())
            .map((colName) => colName.toLowerCase());

          const columnsFields = tableColumns
            .filter((col: { header: string }) =>
              columnsToDelete.includes(col.header.toLowerCase())
            )
            .map((col: { field: any }) => col.field);

          if (columnsFields.length > 0) {


            const updatedMappingRules: MappingRow[] = [];

            this.mappingRules[tableChoice].forEach((row: MappingRow) => {
              const shouldKeepRow = !columnsFields.some(
                (field) => field in row
              );

              if (shouldKeepRow) {
                updatedMappingRules.push(row);
              }
            });

            this.mappingRules[tableChoice] = updatedMappingRules;

            // Remove deleted columns from tableColumns (looping backward to avoid index shift issues)
            for (let i = tableColumns.length - 1; i >= 0; i--) {
              const col = tableColumns[i];
              if (columnsToDelete.includes(col.header.toLowerCase())) {
                tableColumns.splice(i, 1);
              }
            }

            this.cdr.detectChanges();
            this.openDialog(
              `Columns "${columnsInput}" Deleted Successfully from ${tableChoice}!`
            );
          } else {
            this.openDialog('Invalid Columns!');
          }
        }
        break;
      }

      default:
        this.openDialog('Invalid Option!');
        break;
    }
  }

  saveMap() {
    if (!this.isAdmin()) return;
    this.openDialog('Data Saved Successfully!');
    this.isEditing = false;
    this.editingRow = null;
  }

  undoDeleteColumnMap() {
    if (!this.isAdmin()) return;
    alert('Undo content clicked!');
  }

  exportToExcel() {
    alert('Exporting data to Excel...');
  }

  // onPageChange(page: number): void {
  //   this.currentPage = page;
  //   this.updatePaginatedData();
  // }

  // updatePaginatedData(): void {
  //   const startPage = (this.currentPage - 1) * this.itemsPerPage;
  //   const endPage = startPage + this.itemsPerPage;
  //   this.paginatedData = this.mappingRules.slice(startPage, endPage);
  // }

  toggleButtonsVisibility() {
    this.isButtonsVisible = !this.isButtonsVisible;
  }

  toggleColumnActionsVisibility() {
    this.isColumnActionsVisible = !this.isColumnActionsVisible;
  }
}
