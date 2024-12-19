import { ChangeDetectorRef, Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from '../dialog/dialog.component';

export interface TableRow {
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
  ],
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

  statusOptions: string[] = ['Not Started', 'In Progress', 'Complete'];
  usedInOptions = ['Y', 'N'];

  tableData: TableRow[] = this.loadFromStorage('tableData') || [
    {
      srNo: 1,
      tfsReq: 'REQ-001',
      release: '1.0',
      ofsaaPhysicalNames: 'Table_1',
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
      srNo: 2,
      tfsReq: 'REQ-002',
      release: '2.0',
      ofsaaPhysicalNames: 'Table_2',
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

  tableColumns = this.loadFromStorage('tableColumns') || [
    { header: 'Sr. No.', field: 'srNo' },
    { header: 'TFS Req.', field: 'tfsReq' },
    { header: 'Release', field: 'release' },
    { header: 'OFSAA Physical Names', field: 'ofsaaPhysicalNames' },
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
    private dialog: MatDialog
  ) {}

  openDialog(message: string, title: string = 'Notification') {
    this.dialog.open(DialogComponent, {
      data: { title: title, message: message },
    });
  }

  ngOnInit(): void {
    this.updatePaginatedData();
  }

  saveToStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  loadFromStorage(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

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

  addData() {
    if (!this.isAdmin()) return;

    const insertOption = prompt(
      'Where do you want to insert the new row?\n1. At the beginning\n2. At the end\n3. In between\nEnter the number (1, 2, or 3):'
    );

    if (!insertOption) return;

    const newRow: TableRow = {
      srNo: this.tableData.length + 1,
      tfsReq: 'NEW-REQ',
      release: '',
      ofsaaPhysicalNames: 'New Table',
      ofsaaLogicalEntityName: '',
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

    switch (insertOption.trim()) {
      case '1': {
        this.tableData.unshift(newRow);
        this.openDialog('New Row Added At Beginning! You can now Edit it.');
        break;
      }

      case '2': {
        this.tableData.push(newRow);
        this.openDialog('New Row Added At End! You can now Edit it.');
        break;
      }

      case '3': {
        const position = prompt(
          `Enter the position (1 to ${this.tableData.length}) where you want to insert the new row:`
        );

        if (position) {
          const index = Number(position) - 1;
          if (index >= 0 && index <= this.tableData.length) {
            this.tableData.splice(index, 0, newRow);
            this.openDialog(`New Row Added at ${index + 1}! You can now Edit it.`);
          } else {
            this.openDialog('Invalid Position!');
          }
        } else {
          return;
        }
        break;
      }

      default:
        this.openDialog('Invalid option! Please enter 1, 2, or 3.');
        break;
    }

    this.tableData.forEach((row, index) => {
      row.srNo = index + 1;
    });

    this.saveToStorage('tableData', this.tableData);

    this.updatePaginatedData();
    this.cdr.detectChanges();
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
            !row[field] || row[field].toString().trim() === ''
        );
      });

      if (inValidRows.length > 0) {
        this.openDialog('Please Fill All Missing Fields!');
        return;
      }

      this.editingMode = false;
      this.editingRow = null;
      this.cdr.detectChanges();
      this.saveToStorage('tableData', this.tableData);
      this.openDialog('All Rows Saved Successfully!');
    } else {
      this.editingMode = true;
      this.openDialog('You can edit rows now. Click "Save" again to finalize changes.');
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

      this.tableColumns.push(newColumn);

      //add new column to table with empty value
      this.tableData.forEach((row) => {
        row[newField] = '';
      });

      //trigger change detection to update table
      this.cdr.detectChanges();

      this.newColumnName = '';
      // this.newColumnAdded = true;
      this.saveToStorage('tableData', this.tableData);
      this.openDialog(`New Column Added: "${newColumn.header}"!`);
    } else {
      this.openDialog('Please Enter Column Name!');
    }
  }

  saveColumnData(row: TableRow, column: any, event: Event) {
    if (!row || !column || !column.field) {
      this.openDialog('Invalid row or column data');
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    if (!inputElement || inputElement.value === undefined) {
      this.openDialog('Invalid input element');
      return;
    }

    const newValue = inputElement.value;

    row[column.field] = newValue;

    // this.newColumnAdded = false;
    row[column.field + '_dirty'] = newValue !== '';

    console.log(`Updated column '${column.field}' with value: ${newValue}`);
    this.openDialog(`Data for column '${column.header}' Added with value: ${newValue}!`);
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

  deleteRow() {
    if (!this.isAdmin()) return;

    const deleteOption = prompt(
      'Choose an option for deletion:\n1. Delete a specific row\n2. Delete a range of rows\n3. Delete all rows\nEnter the number (1, 2, or 3):'
    );

    if (!deleteOption) return;

    switch (deleteOption.trim()) {
      case '1': {
        const rowNum = prompt('Enter the row number you want to delete: ');
        if (rowNum) {
          const rowIndex = this.tableData.findIndex(
            (row) => row.srNo === Number(rowNum)
          );

          if (rowIndex !== -1) {
            this.tableData.splice(rowIndex, 1);
            this.cdr.detectChanges();
            this.saveToStorage('tableData', this.tableData);
            this.openDialog(`Row ${rowNum} Deleted Successfully!`);
          } else {
            this.openDialog('Row Number Not Found!');
          }
        }
        break;
      }

      case '2': {
        // const startRowNum = prompt('Enter the starting row number: ');
        // const endRowNum = prompt('Enter the ending row number: ');
        const rangeInput = prompt(
          'Enter the starting and ending row numbers (separated by hyphen [-] ):'
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
            this.saveToStorage('tableData', this.tableData);
            this.openDialog(`Rows ${startRowNum} to ${endRowNum} Deleted SuccessFully!`);
          } else {
            this.openDialog('Invalid Series of Row Numbers!');
          }
        }
        break;
      }

      case '3': {
        const rowAllDelete = confirm(
          'Are you sure you want to delete all rows? This action cannot be undone.'
        );
        if (rowAllDelete) {
          this.tableData = [];
          this.cdr.detectChanges();
          this.saveToStorage('tableData', this.tableData);
          this.openDialog('All Rows Deleted Successfully!');
        }
        break;
      }

      default:
        this.openDialog('Invalid option! Please enter 1, 2, or 3.');
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

  editColumnData() {
    if (!this.isAdmin()) return;

    const colmnToEdit = prompt(
      `Select a column to Edit by Entering it's Header Name:\n`
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

    const editOption = prompt(
      `Choose an option for Editing "${selectedColumn.header}":\n1. Edit all rows\n2. Edit a series of rows\nEnter the number (1 or 2):`
    );

    if (!editOption) return;

    switch (editOption.trim()) {
      case '1': {
        const newValue = prompt(
          `Enter new value for all rows in the "${selectedColumn.header}" column:`
        );

        if (newValue != null) {
          this.tableData.forEach((row) => {
            row[selectedColumn.field] = newValue;
          });

          this.openDialog(
            `All rows in the "${selectedColumn.header}" column updated with value: ${newValue}!`
          );
          this.updatePaginatedData();
          this.cdr.detectChanges();
        }
        break;
      }

      case '2': {
        const rangeInput = prompt(
          `Enter the starting and ending row numbers (separated by a hyphen [-]) to edit in the "${selectedColumn.header}" column:`
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
            const newValue = prompt(
              `Enter new value for rows ${startRowNum} to ${endRowNum} in the "${selectedColumn.header}" column:`
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
        this.openDialog('Invalid option! Please enter 1 or 2.');
        break;
    }
  }

  saveAllColumns(): void {
    if (!this.isAdmin()) return;

    if (this.editingMode) {
      const requiredFields = this.tableColumns.map(
        (colm: { field: any }) => colm.field
      );

      const inValidRows = this.tableData.filter((row) => {
        return requiredFields.some(
          (field: string | number) =>
            !row[field] || row[field].toString().trim() === ''
        );
      });

      if (inValidRows.length > 0) {
        this.openDialog('Please fill in All Missing Column Data Before Saving!');
        return;
      }

      this.editingMode = false;
      this.cdr.detectChanges();
      this.openDialog('All Columns Saved Successfully!');
    } else {
      this.editingMode = true;
      this.openDialog(
        'You can Edit All Columns Now! Click "Save All Columns" Again to Finalize Changes.'
      );
    }
  }
}
