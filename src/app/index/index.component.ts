import { ChangeDetectorRef, Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from '../dialog/dialog.component';
import { firstValueFrom, range } from 'rxjs';
import { Router } from '@angular/router';
import {
  DataMappingRuleComponent,
  MappingRow,
} from '../data-mapping-rule/data-mapping-rule.component';
import { TabService } from '../tab.service';
import { SharedListService } from '../shared-list.service';

export interface TableRow {
  id: string;
  [key: string]: string | number | boolean | any; // Allow dynamic keys
  srNo: number;
  tfsReq: string;
  release: string;
  ofsaaPhysicalNames: string;
  ofsaaLogicalEntityName: string;
  source: string;
  typeOfData: string;
  frequency: string;
  loadMode: string;
  loadType: string;
  expectedVolume: string;
  mappingStatus: string;
  odiBuildStatus: string;
  reviewStatus: string;
  usedInEFRA: string;
  usedInCECL: string;
  usedInAML: string;
  usedInOnestream: string;
  usedInCCAR: string;
  usedInAXIOM: string;
  mappedTables: string[];
}

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    MatDialogModule,
    MatButtonModule,
    DataMappingRuleComponent,
  ],
  providers: [DataMappingRuleComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {
  [x: string]: any;
  searchText: string = '';
  searchColumn: string = '';
  newColumnName: string = '';
  editingMode: boolean = false;
  editingRow: TableRow | null = null; // Keeps track of currently edited row
  currentPage = 1;
  itemsPerPage = 10;
  paginatedData: TableRow[] = []; // Holds current page data
  isButtonsVisible: boolean = false;
  isColumnActionsVisible: boolean = false;
  activeTab: string = '';

  statusOptions: string[] = ['Not Started', 'In Progress', 'Complete'];
  usedInOptions = ['Y', 'N'];
  availableTables: string[] = [
    'Pre-Stage Table',
    'Stage Table',
    'Lookup Table',
  ];

  tableData: TableRow[] = [
    {
      id: 'existing-1',
      srNo: 1,
      tfsReq: 'REQ-001',
      release: '1.0',
      ofsaaPhysicalNames: 'Table_1',
      mappedTables: [],
      ofsaaLogicalEntityName: 'Entity_1',
      source: 'Source_1',
      typeOfData: 'Transactional',
      frequency: 'Daily',
      loadMode: 'Incremental',
      loadType: 'Full Load',
      expectedVolume: '100K',
      mappingStatus: 'Not Started',
      odiBuildStatus: 'Complete',
      reviewStatus: 'Not Started',
      usedInEFRA: 'Y',
      usedInCECL: 'N',
      usedInAML: 'Y',
      usedInOnestream: 'Y',
      usedInCCAR: 'N',
      usedInAXIOM: 'Y',
    },
    {
      id: 'existing-2',
      srNo: 2,
      tfsReq: 'REQ-002',
      release: '2.0',
      ofsaaPhysicalNames: 'Table_2',
      mappedTables: [],
      ofsaaLogicalEntityName: 'Entity_2',
      source: 'Source_2',
      typeOfData: 'Master',
      frequency: 'Weekly',
      loadMode: 'Full Load',
      loadType: 'Incremental',
      expectedVolume: '200K',
      mappingStatus: 'In Progress',
      odiBuildStatus: 'In Progress',
      reviewStatus: 'Complete',
      usedInEFRA: 'N',
      usedInCECL: 'Y',
      usedInAML: 'N',
      usedInOnestream: 'N',
      usedInCCAR: 'Y',
      usedInAXIOM: 'Y',
    },
  ];

  tableColumns: Array<{ header: string; field: string }> = [
    { header: 'Sr. No.', field: 'srNo' },
    { header: 'TFS Req.', field: 'tfsReq' },
    { header: 'Release', field: 'release' },
    { header: 'OFSAA Physical Names', field: 'ofsaaPhysicalNames' },
    { header: 'Mapped Tables', field: 'mappedTables' },
    { header: 'OFSAA Logical Entity Name', field: 'ofsaaLogicalEntityName' },
    { header: 'Source', field: 'source' },
    { header: 'Type of Data', field: 'typeOfData' },
    { header: 'Frequency', field: 'frequency' },
    { header: 'Load Mode', field: 'loadMode' },
    { header: 'Load Type', field: 'loadType' },
    { header: 'Expected Volume', field: 'expectedVolume' },
    { header: 'Mapping Status', field: 'mappingStatus' },
    { header: 'ODI Build Status', field: 'odiBuildStatus' },
    { header: 'Review Status', field: 'reviewStatus' },
    { header: 'Used in EFRA', field: 'usedInEFRA' },
    { header: 'Used in CECL', field: 'usedInCECL' },
    { header: 'Used in AML', field: 'usedInAML' },
    { header: 'Used in Onestream', field: 'usedInOnestream' },
    { header: 'Used in CCAR', field: 'usedInCCAR' },
    { header: 'Used in AXIOM', field: 'usedInAXIOM' },
  ];


  constructor(
    private roleService: RoleService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private dataMappingRuleComponent: DataMappingRuleComponent,
    private tabService: TabService,
    private sharedList: SharedListService
  ) {}

  passOfsaaPhysicalNamesList(): void {
    const ofsaaPhysicalNamesList = this.tableData.map(
      (row) => row.ofsaaPhysicalNames
    );
    this.sharedList.setOfsaaPhysicalNamesList(ofsaaPhysicalNamesList);
  }

  navigateToDataMappingRule(ofsaaPhysicalNames?: string): void {
    const queryParams: any = {};

    // If a specific ofsaaPhysicalNames is provided, add it to the query parameters
    if (ofsaaPhysicalNames) {
      queryParams.ofsaaPhysicalNames = ofsaaPhysicalNames;
    }

    // Always pass the list of all ofsaaPhysicalNames
    // const ofsaaPhysicalNamesList = this.tableData.map(
    //   (row) => row.ofsaaPhysicalNames
    // );
    // queryParams.ofsaaPhysicalNamesList = JSON.stringify(ofsaaPhysicalNamesList);

    // Navigate with query parameters
    this.router.navigate(['/data-mapping-rule'], {
      queryParams: queryParams,
    });
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
    // p0: string[],
    // useCheckboxes: boolean,
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
        // useCheckboxes,
        // selectedTables: p0,
      },
    });

    // return dialogRef.afterClosed().toPromise();
    return firstValueFrom(dialogRef.afterClosed());
  }

  ngOnInit(): void {
    this.passOfsaaPhysicalNamesList();
    this.updatePaginatedData();
  }

  // saveToStorage(key: string, data: any): void {
  //   localStorage.setItem(key, JSON.stringify(data));
  // }

  // loadFromStorage(key: string): any {
  //   const data = localStorage.getItem(key);
  //   return data ? JSON.parse(data) : null;
  // }

  isAdmin(): boolean {
    return this.roleService.getRole() === 'Admin';
  }

  filteredData(): TableRow[] {
    if (!this.searchText) return this.tableData;

    return this.tableData.filter((row) => {
      if (this.searchColumn) {
        const value = row[this.searchColumn];
        return this.matchText(value);
      } else {
        return Object.values(row).some((val) => this.matchText(val));
      }
    });
  }

  matchText(value: any): boolean {
    if (value && this.searchText.trim() !== '') {
      return value
        .toString()
        .toLowerCase()
        .includes(this.searchText.toLowerCase());
    }
    return false;
  }

  async addData() {
    if (!this.isAdmin()) return;

    // const useCheckboxes = true;
    const selectedTables = await this.openInputDialog(
      'Select Table',
      'Select the Table for this New Row First',
      '',
      '',
      'Select Tables:',
      ['Pre-Stage Table', 'Stage Table', 'Lookup Table'],
      'Pre-Stage Table'
    );

    if (!selectedTables) {
      this.openDialog('No tables selected! Row not inserted.');
      return;
    }

    const insertOption = await this.openInputDialog(
      'Insert Row',
      'Where do you want to Insert the New Row?',
      '',
      '',
      'Select Any Option:',
      ['At the Beginning', 'At the End', 'In Between'],
      'At the Beginning'
    );

    if (!insertOption) return;

    const newId = Date.now().toString();

    // Define the new row to insert
    const newRow: TableRow = {
      id: newId,
      srNo: this.tableData.length + 1,
      tfsReq: 'NEW-REQ',
      release: '',
      ofsaaPhysicalNames: 'New Table',
      ofsaaLogicalEntityName: '',
      mappedTables: [],
      source: '',
      typeOfData: '',
      frequency: '',
      loadMode: '',
      loadType: '',
      expectedVolume: '',
      mappingStatus: 'Not Started',
      odiBuildStatus: 'Not Started',
      reviewStatus: 'Not Started',
      usedInEFRA: 'Y',
      usedInCECL: 'Y',
      usedInAML: 'N',
      usedInOnestream: 'Y',
      usedInCCAR: 'N',
      usedInAXIOM: 'N',
    };

    // Insert the row at the selected position
    switch (insertOption.trim()) {
      case 'At the Beginning': {
        this.tableData.unshift(newRow);
        this.openDialog('New Row Added At Beginning! You can now Edit it.');
        break;
      }

      case 'At the End': {
        this.tableData.push(newRow);
        this.openDialog('New Row Added At End! You can now Edit it.');
        break;
      }

      case 'In Between': {
        const position = await this.openInputDialog(
          'Select Position',
          `Enter the Position (1 to ${this.tableData.length}) where you want to Insert New Row:`,
          'Position',
          ''
        );

        if (position) {
          const index = Number(position) - 1;
          if (index >= 0 && index <= this.tableData.length) {
            this.tableData.splice(index, 0, newRow);
            this.openDialog(
              `New Row Added at ${index + 1}! You can now Edit it.`
            );
          } else {
            this.openDialog('Invalid Position!');
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

    this.tableData.forEach((row, index) => {
      row.srNo = index + 1;
    });

    console.log('Selected table:', selectedTables);
    this.tabService.addSelectedTable(selectedTables, newRow.id);
    newRow.mappedTables.push(selectedTables);
    this.tabService.setCurrentRowId(newRow.id);
    this.insertRowIntoTable(newRow, selectedTables);

    // this.saveToStorage('tableData', this.tableData);
    this.updatePaginatedData();
    this.cdr.detectChanges();
  }

  insertRowIntoTable(newRow: MappingRow, table: string): void {
    console.log(`Row inserted into ${table}:`, newRow);
    this.openDialog(`Row Inserted in : ${table}`);

    switch (table) {
      case 'Pre-Stage Table':
        // this.dataMappingRuleComponent.insertIntoPreStageTable(newRow);
        this.dataMappingRuleComponent.mappingRules['sourceTable'].push(newRow);
        this.dataMappingRuleComponent.mappingRules['fdsPreStageTable'].push(
          newRow
        );
        break;
      case 'Stage Table':
        // this.dataMappingRuleComponent.insertIntoStageTable(newRow);
        this.dataMappingRuleComponent.mappingRules['fdsPreStageTable1'].push(
          newRow
        );
        this.dataMappingRuleComponent.mappingRules['fdsStageTable'].push(
          newRow
        );
        break;
      case 'Lookup Table':
        // this.dataMappingRuleComponent.insertIntoIdTpTable(newRow);
        this.dataMappingRuleComponent.mappingRules['fdsgenerated'].push(newRow);
        this.dataMappingRuleComponent.mappingRules['lookupMapTable'].push(
          newRow
        );
        break;
      default:
        this.openDialog('Invalid option!');
        break;
    }
    this.updatePaginatedData();
    this.cdr.detectChanges();
  }

  selectRow(row: TableRow): void {
    this.editingRow = row;
    this.tabService.setCurrentRowId(row.id);
  }

  saveNewRow() {
    if (!this.isAdmin()) return;

    if (this.editingMode) {
      const requiredFields = this.tableColumns.map(
        (column: { field: any }) => column.field
      );

      const inValidRows = this.tableData.filter((row) => {
        return requiredFields.some(
          (field: string | number) =>
            row[field] || row[field].toString().trim() === ''
        );
      });

      if (inValidRows.length > 0) {
        this.openDialog('Please Fill All Missing Fields!');
        return;
      }

      this.editingMode = false;
      this.editingRow = null;
      this.cdr.detectChanges();
      // this.saveToStorage('tableData', this.tableData);
      this.openDialog('All Rows Saved Successfully!');
    } else {
      this.editingMode = true;
      this.openDialog(
        'You can Edit rows now. Click "Save" again to finalize changes.'
      );
    }
  }

  addColumn() {
    if (!this.isAdmin()) return;

    console.log('New Column Name: ', this.newColumnName);

    if (this.newColumnName.trim() !== '') {
      const newField = this.newColumnName.replace(/\s+/g, '').toLowerCase();

      const newColumn = {
        header: this.newColumnName,
        field: newField,
      };

      if (
        this.tableColumns.some(
          (colm: { field: string; header: string }) =>
            colm.field === newField || colm.header === this.newColumnName
        )
      ) {
        this.openDialog(`Column "${this.newColumnName}" Already exists!`);
        return;
      }

      // this.tableColumns.push(newColumn);
      this.tableColumns = [...this.tableColumns, newColumn];

      //add new column to table with empty value
      this.tableData.forEach((row) => {
        row[newField] = '';
      });

      //trigger change detection to update table
      this.cdr.detectChanges();

      this.newColumnName = '';
      // this.newColumnAdded = true;
      // this.saveToStorage('tableData', this.tableData);
      this.openDialog(`New Column Added: "${newColumn.header}"!`);
    } else {
      this.openDialog('Please Enter Column Name!');
    }
  }

  saveColumnData(row: TableRow, column: any, event: Event) {
    if (!row || !column || !column.field) {
      this.openDialog('Invalid Row or Column data!');
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    if (!inputElement || inputElement.value === undefined) {
      this.openDialog('Invalid Input Element!');
      return;
    }

    const newValue = inputElement.value;

    row[column.field] = newValue;

    // this.newColumnAdded = false;
    row[column.field + '_dirty'] = newValue !== '';

    // this.openDialog(
    //   `Data for column '${column.header}' Added with value: ${newValue}!`
    // );
  }

  editData(row: TableRow): void {
    if (!this.isAdmin()) return;

    if (this.editingRow === row) {
      //save changes and exit
      this.editingRow = null;
      this.openDialog(`Edited Data Sucessfully!`);
    } else {
      //enable edit mode
      this.editingRow = row;
    }
  }

  async deleteRow() {
    if (!this.isAdmin()) return;

    const deleteOption = await this.openInputDialog(
      'Delete Row',
      'Choose an option for Deletion:',
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

    switch (deleteOption.trim()) {
      case 'Delete a specific row': {
        const rowNum = await this.openInputDialog(
          'Select Position',
          'Enter the Row Number you want to Delete: ',
          'Row Number',
          ''
        );
        if (rowNum) {
          const rowIndex = this.tableData.findIndex(
            (row) => row.srNo === Number(rowNum)
          );

          if (rowIndex !== -1) {
            this.tableData.splice(rowIndex, 1);
            this.cdr.detectChanges();
            // this.saveToStorage('tableData', this.tableData);
            this.openDialog(`Row ${rowNum} Deleted Successfully!`);
          } else {
            this.openDialog('Row Number Not Found!');
          }
        }
        break;
      }

      case 'Delete a range of rows': {
        // const startRowNum = prompt('Enter the starting row number: ');
        // const endRowNum = prompt('Enter the ending row number: ');
        const rangeInput = await this.openInputDialog(
          'Select Range',
          'Enter the Starting and Ending Row Numbers (separated by hyphen [-] ):',
          'Range',
          ''
        );
        if (rangeInput) {
          const [startRowNum, endRowNum] = rangeInput
            .split('-')
            .map((num) => num.trim());
          const startIndex = this.tableData.findIndex(
            (row) => row.srNo === Number(startRowNum)
          );
          const endIndex = this.tableData.findIndex(
            (row) => row.srNo === Number(endRowNum)
          );

          if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
            this.tableData.splice(startIndex, endIndex - startIndex + 1);
            this.cdr.detectChanges();
            // this.saveToStorage('tableData', this.tableData);
            this.openDialog(
              `Rows ${startRowNum} to ${endRowNum} Deleted SuccessFully!`
            );
          } else {
            this.openDialog('Invalid Series of Row Numbers!');
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
          const invalidRows = rowNumbers.filter(
            (num) => !this.tableData.some((row) => row.srNo === num)
          );

          if (invalidRows.length > 0) {
            this.openDialog(`Row numbers not found: ${invalidRows.join(', ')}`);
          } else {
            this.tableData = this.tableData.filter(
              (row) => !rowNumbers.includes(row.srNo)
            );
            this.cdr.detectChanges();
            // this.saveToStorage('tableData', this.tableData);
            this.openDialog(
              `Rows ${rowNumbers.join(', ')} Deleted Successfully!`
            );
          }
        }
        break;
      }

      case 'Delete all rows': {
        const rowAllDelete = await this.openInputDialog(
          'Delete Confirmation',
          'Are you sure you want to delete all rows? This action cannot be undone.',
          '',
          '',
          '',
          []
        );
        if (rowAllDelete) {
          this.tableData = [];
          this.cdr.detectChanges();
          // this.saveToStorage('tableData', this.tableData);
          this.openDialog('All Rows Deleted Successfully!');
        }
        break;
      }

      default:
        this.openDialog('Invalid option!');
        break;
    }
  }

  isEllipsisActive(element: HTMLElement | null): boolean {
    if (!element) return false;
    return element.offsetWidth < element.scrollWidth;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startPage = (this.currentPage - 1) * this.itemsPerPage;
    const endPage = startPage + this.itemsPerPage;
    this.paginatedData = this.tableData.slice(startPage, endPage);
  }

  async editColumnData() {
    if (!this.isAdmin()) return;

    const colmnToEdit = await this.openInputDialog(
      'Edit Row',
      `Select a column to Edit by Entering it's exact Header Name: `,
      'Header Name',
      ''
    );
    // ${this.tableColumns.map((col) => col.header).join(', ')}`);

    if (!colmnToEdit) return;

    const selectedColumn = this.tableColumns.find(
      (colm: { header: string }) =>
        colm.header.toLowerCase() === colmnToEdit.toLowerCase()
    );

    if (!selectedColumn) {
      this.openDialog('Invalid Column Name! Please Try Again.');
      return;
    }

    const editOption = await this.openInputDialog(
      'Select Editing Option',
      `Choose an option for Editing "${selectedColumn.header}":`,
      '',
      '',
      'Select Any Option: ',
      ['Edit All rows', 'Edit a Series of Rows'],
      'Edit All rows'
    );

    if (!editOption) return;

    switch (editOption.trim()) {
      case 'Edit All rows': {
        const newValue = await this.openInputDialog(
          'Enter Value',
          `Enter new value for all rows in the "${selectedColumn.header}" column:`,
          'Value',
          ''
        );

        if (newValue != null) {
          this.tableData.forEach((row) => {
            row[selectedColumn.field] = newValue;
          });

          this.openDialog(
            `All rows in the "${selectedColumn.header}" column Updated with value: ${newValue}!`
          );
          this.updatePaginatedData();
          this.cdr.detectChanges();
        }
        break;
      }

      case 'Edit a Series of Rows': {
        const rangeInput = await this.openInputDialog(
          'Enter Series',
          `Enter the Starting and Ending Row Numbers (separated by a hyphen [-]) to Edit in the "${selectedColumn.header}" column:`,
          'Series',
          ''
        );

        if (rangeInput) {
          const [startRowNum, endRowNum] = rangeInput
            .split('-')
            .map((num) => num.trim());
          const startIndex = this.tableData.findIndex(
            (row) => row.srNo === Number(startRowNum)
          );
          const endIndex = this.tableData.findIndex(
            (row) => row.srNo === Number(endRowNum)
          );

          if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
            const newValue = await this.openInputDialog(
              'Enter Value',
              `Enter new value for rows ${startRowNum} to ${endRowNum} in the "${selectedColumn.header}" column:`,
              'Value',
              ''
            );

            if (newValue !== null) {
              for (let i = startIndex; i <= endIndex; i++) {
                this.tableData[i][selectedColumn.field] = newValue;
              }

              this.openDialog(
                `Rows ${startRowNum} to ${endRowNum} in the "${selectedColumn.header}" column updated with value: ${newValue}!`
              );
              this.updatePaginatedData();
              this.cdr.detectChanges();
            }
          }
        } else {
          this.openDialog('Invalid series of row numbers!');
        }
        break;
      }

      default:
        this.openDialog('Invalid option!');
        break;
    }
  }

  // saveAllColumns(): void {
  //   if (!this.isAdmin()) return;

  //   if (this.editingMode) {
  //     const requiredFields = this.tableColumns.map(
  //       (colm: { field: any }) => colm.field
  //     );

  //     const inValidRows = this.tableData.filter((row) => {
  //       return requiredFields.some(
  //         (field: string | number) =>
  //           !row[field] || row[field].toString().trim() === ''
  //       );
  //     });

  //     if (inValidRows.length > 0) {
  //       this.openDialog(
  //         'Please Fill in All Missing Column Data Before Saving!'
  //       );
  //       return;
  //     }

  //     this.editingMode = false;
  //     this.cdr.detectChanges();
  //     this.openDialog('All Columns Saved Successfully!');
  //   } else {
  //     this.editingMode = true;
  //     this.openDialog(
  //       'You can Edit All Columns Now! Click "Save All Columns" Again to Finalize Changes.'
  //     );
  //   }
  // }

  saveData(): void {
    if (!this.isAdmin()) return;

    const requiredFields = this.tableColumns.map(
      (column: { field: any }) => column.field
    );

    // Check for missing data in rows or columns
    const hasInvalidData = this.tableData.some((row) => {
      return requiredFields.some(
        (field: string | number) =>
          !row[field] || row[field].toString().trim() === ''
      );
    });

    if (hasInvalidData) {
      this.openDialog(
        'Please Fill in All Missing Fields in Rows or Columns Before Saving!'
      );
      return;
    }

    if (this.editingMode) {
      this.editingMode = false;
      this.editingRow = null;
      this.cdr.detectChanges();
      // this.saveToStorage('tableData', this.tableData);
      this.openDialog('Data Saved Successfully!');
    } else {
      this.editingMode = true;
      this.openDialog(
        'You can Edit Rows and Columns Now! Click "Save Data" Again to Finalize Changes.'
      );
    }
  }

  // backupColumnsBeforeDeletion() {
  //   // Backing up the current state of tableColumns and tableData
  //   localStorage.setItem(
  //     'tableColumnsBackup',
  //     JSON.stringify(this.tableColumns)
  //   );
  //   localStorage.setItem('tableDataBackup', JSON.stringify(this.tableData));
  // }

  async deleteColumn() {
    if (!this.isAdmin()) return;

    // this.backupColumnsBeforeDeletion();

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

    switch (deleteOption.trim()) {
      case 'Delete a Specific Column': {
        const colName = await this.openInputDialog(
          'Select Column to Delete',
          'Enter exact Header Name of the Column you want to Delete: ',
          'Column Name',
          ''
        );

        if (colName) {
          const columnIndex = this.tableColumns.findIndex(
            (col: { header: string }) =>
              col.header.toLowerCase() === colName.toLowerCase()
          );

          if (columnIndex !== -1) {
            const columnDelete = this.tableColumns[columnIndex].field;

            this.tableColumns.splice(columnIndex, 1);

            this.tableData.forEach((row) => {
              delete row[columnDelete];
            });
            // this.saveToStorage('tableData', this.tableData);
            // this.saveToStorage('tableColumns', this.tableColumns);
            this.cdr.detectChanges();
            this.openDialog(`Column "${colName}" Deleted Successfully!`);
          } else {
            this.openDialog('Invalid Column!');
          }
        }
        break;
      }

      case 'Delete a Range of Columns': {
        const rangeInput = await this.openInputDialog(
          'Select Range',
          'Enter the Starting and Ending column headers (separated by hyphen [-]) to Delete: ',
          'Range',
          ''
        );

        if (rangeInput) {
          const [startColumn, endColumn] = rangeInput
            .split('-')
            .map((col) => col.trim());

          const startIndex = this.tableColumns.findIndex(
            (col: { header: string }) =>
              col.header.toLowerCase() === startColumn.toLowerCase()
          );
          const endIndex = this.tableColumns.findIndex(
            (col: { header: string }) =>
              col.header.toLowerCase() === endColumn.toLowerCase()
          );

          if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
            const columnToDelete = this.tableColumns
              .splice(startIndex, endIndex + 1)
              .map((col: { field: any }) => col.field);

            this.tableColumns.splice(startIndex, endIndex - startIndex + 1);

            this.tableData.forEach((row) => {
              columnToDelete.forEach(
                (field: string | number) => delete row[field]
              );
            });
            // this.saveToStorage('tableData', this.tableData);
            // this.saveToStorage('tableColumns', this.tableColumns);
            this.cdr.detectChanges();
            this.openDialog(
              `Columns from "${startColumn}" to "${endColumn}" Deleted Successfully!`
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
          'Enter the Column Headers separated by comma (,) to Delete: ',
          'Columns',
          ''
        );

        if (columnsInput) {
          const columnsDelete = columnsInput
            .split(',')
            .map((col) => col.trim())
            .map((colName) => colName.toLowerCase());

          const columnsFields = this.tableColumns
            .filter((col: { header: string }) =>
              columnsDelete.includes(col.header.toLowerCase())
            )
            .map((col: { field: any }) => col.field);

          if (columnsFields.length > 0) {
            this.tableColumns = this.tableColumns.filter(
              (col: { header: string }) =>
                !columnsDelete.includes(col.header.toLowerCase())
            );

            this.tableData.forEach((row) => {
              columnsFields.forEach(
                (field: string | number) => delete row[field]
              );
            });
            // this.saveToStorage('tableData', this.tableData);
            // this.saveToStorage('tableColumns', this.tableColumns);
            this.cdr.detectChanges();
            this.openDialog(`Columns "${columnsInput}" Deleted Successfully!`);
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

  // async undoDeleteColumn() {
  //   // Retrieve the backup of the original columns and data from localStorage
  //   const backupTableColumns = JSON.parse(
  //     localStorage.getItem('tableColumnsBackup') || '[]'
  //   );
  //   const backupTableData = JSON.parse(
  //     localStorage.getItem('tableDataBackup') || '[]'
  //   );

  //   if (backupTableColumns.length > 0) {
  //     // Restore the original tableColumns and tableData
  //     this.tableColumns = backupTableColumns;
  //     this.tableData = backupTableData;

  //     // Save the restored state back to localStorage
  //     localStorage.setItem('tableColumns', JSON.stringify(this.tableColumns));
  //     localStorage.setItem('tableData', JSON.stringify(this.tableData));

  //     this.cdr.detectChanges();

  //     this.openDialog('All column Deletions have been undone!');
  //   } else {
  //     this.loadColumnsFromStorage();
  //     this.openDialog('No previous column Deletions Found to undo!');
  //   }
  // }

  // saveToStorage(key: string, data: any): void {
  //   localStorage.setItem(key, JSON.stringify(data));
  // }

  // loadColumnsFromStorage() {
  //   // Retrieve tableColumns from localStorage
  //   const storedTableColumns = JSON.parse(
  //     localStorage.getItem('tableColumns') || '[]'
  //   );

  //   if (storedTableColumns.length === 0) {
  //     // If not found in localStorage, save default columns
  //     const defaultTableColumns = [
  //       { header: 'Sr. No.', field: 'srNo' },
  //       { header: 'TFS Req.', field: 'tfsReq' },
  //       { header: 'Release', field: 'release' },
  //       { header: 'OFSAA Physical Names', field: 'ofsaaPhysicalNames' },
  //       { header: 'Mapped Tables', field: 'mappedTables' },
  //       {
  //         header: 'OFSAA Logical Entity Name',
  //         field: 'ofsaaLogicalEntityName',
  //       },
  //       { header: 'Source', field: 'source' },
  //       { header: 'Type of Data', field: 'typeOfData' },
  //       { header: 'Frequency', field: 'frequency' },
  //       { header: 'Load Mode', field: 'loadMode' },
  //       { header: 'Load Type', field: 'loadType' },
  //       { header: 'Expected Volume', field: 'expectedVolume' },
  //       { header: 'Mapping Status', field: 'mappingStatus' },
  //       { header: 'ODI Build Status', field: 'odiBuildStatus' },
  //       { header: 'Review Status', field: 'reviewStatus' },
  //       { header: 'Used in EFRA', field: 'usedInEFRA' },
  //       { header: 'Used in CECL', field: 'usedInCECL' },
  //       { header: 'Used in AML', field: 'usedInAML' },
  //       { header: 'Used in Onestream', field: 'usedInOnestream' },
  //       { header: 'Used in CCAR', field: 'usedInCCAR' },
  //       { header: 'Used in AXIOM', field: 'usedInAXIOM' },
  //     ];

  //     localStorage.setItem('tableColumns', JSON.stringify(defaultTableColumns));
  //   }

  //   this.tableColumns = storedTableColumns;
  //   this.cdr.detectChanges();
  // }

  toggleButtonsVisibility() {
    this.isButtonsVisible = !this.isButtonsVisible;
  }

  toggleColumnActionsVisibility() {
    this.isColumnActionsVisible = !this.isColumnActionsVisible;
  }
}
