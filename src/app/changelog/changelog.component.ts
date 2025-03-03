import { ChangeDetectorRef,Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { DialogComponent } from '../dialog/dialog.component';
import { firstValueFrom, range } from 'rxjs';

export interface TableRow{
  [key: string]: string | number | boolean | Date;
  srNo: number;
  ofsaaMappingChangeDate: Date;
  ofsaaStageTableName: string;
  changeDetails: string;
  ofsaaChangeBy: string;
  odiBuildStatus: string;
  odiBuildDate: Date;
  verified_yn: string;
  verifiedBy: string;
  verifiedDate: Date;
  comments: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [NavbarComponent, CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css'
})
export class ChangelogComponent {
  [x: string]: any;
  searchText: string = '';
  searchColumn: string = '';
  newColumnName: string = '';
  editingMode: boolean = false;
  editingRow: TableRow | null = null;
  currentPage = 1;
  itemsPerPage = 10;
  paginatedData: TableRow[] = [];
  verifiedOptions: string[] = ['Yes','No'];
  userOptions = ['User1', 'User2', 'User3'];
  buildStatusOptions = ['Pending', 'Completed'];
  adminOptions = ['Admin', 'SuperAdmin', 'Manager'];
  selected: any;
  selectedRows: any[] = [];
  isButtonsVisible: boolean = false;
  isColumnActionsVisible: boolean = false;
  selectAll = false; 
  tableData: TableRow[] = [
    {
      srNo: 1,
  ofsaaMappingChangeDate: new Date(12/12/2024),
  ofsaaStageTableName: 'Data Table',
  changeDetails: 'Not Available',
  ofsaaChangeBy: 'User1',
  odiBuildStatus: 'Pending',
  odiBuildDate:  new Date(12/12/2024),
  verified_yn: 'Yes',
  verifiedBy: 'Admin',
  verifiedDate: new Date(12/12/2024),
  comments: 'Not Available',
  isSelected: false,
    },
    {
      srNo: 2,
  ofsaaMappingChangeDate: new Date(14/12/2024),
  ofsaaStageTableName: 'Source Table',
  changeDetails: 'Available',
  ofsaaChangeBy: 'User2',
  odiBuildStatus: 'Pending',
  odiBuildDate:  new Date(14/12/2024),
  verified_yn: 'No',
  verifiedBy: 'Admin',
  verifiedDate: new Date(14/12/2024),
  comments: 'Not Available',
  isSelected: false,
    },
  ];

  tableColumns = [
    {header: 'Sr. No.',field:'srNo'},
    {header: 'OFSAA Mapping Change Date',field:'ofsaaMappingChangeDate'},
    {header: 'OFSAA Stage Table Name',field:'ofsaaStageTableName'},
    {header: 'Change Details',field:'changeDetails'},
    {header: 'OFSAA Change By',field:'ofsaaChangeBy'},
    {header: 'ODI Build Status',field:'odiBuildStatus'},
    {header: 'ODI Build Date',field:'odiBuildDate'},
    {header: 'Verified Y/N',field:'verified_yn'},
    {header: 'Verified by',field:'verifiedBy'},
    {header: 'Verified Date',field:'verifiedDate'},
    {header: 'Comments',field:'comments'},
  ];

  constructor(private roleService: RoleService,private cdr: ChangeDetectorRef,private dialog: MatDialog) {}

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

    return firstValueFrom(dialogRef.afterClosed());
  }

  ngOnInit(): void {
    this.updatePaginatedData();
  }
  
  isAdmin(): boolean {
    return this.roleService.getRole() === 'Admin';
  }

  toggleEdit(row: TableRow): void {
    if (this.editingRow === row) {
      this.editingRow = null;
    } else {
      this.editingRow = row;
    }
  }

  filteredData() {
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


  updateTableData(): void {
    this.updatePaginatedData();
    this.cdr.detectChanges();
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
          this.openDialog('All Rows Deleted Successfully!');
        }
        break;
      }

      default:
        this.openDialog('Invalid option!');
        break;
    }
  }
  
  async addData(){
    if (!this.isAdmin()) return;
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

    const newRow: TableRow = {
      srNo: this.tableData.length +1,
      ofsaaMappingChangeDate: new (Date),
      ofsaaStageTableName: '',
      changeDetails: '',
      ofsaaChangeBy: '',
      odiBuildStatus: '',
      odiBuildDate: new (Date),
      verified_yn: '',
      verifiedBy: '',
      verifiedDate: new (Date),
      comments: '',
      isSelected: false
    };

    switch(insertOption.trim()){
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

    //this.saveToStorage('tableData', this.tableData);

    this.updatePaginatedData();
    this.cdr.detectChanges();
  }

  addChange() {
    if(!this.isAdmin()) return;

    const insertOption = prompt(
      'Where do you want to insert the new row?\n1. At the beginning\n2. At the end\n3. In between\nEnter the number (1, 2, or 3):'
    );

    if(!insertOption) return;

    const newRow: TableRow ={
      srNo: this.tableData.length +1,
      ofsaaMappingChangeDate: new (Date),
      ofsaaStageTableName: '',
      changeDetails: '',
      ofsaaChangeBy: '',
      odiBuildStatus: '',
      odiBuildDate: new (Date),
      verified_yn: '',
      verifiedBy: '',
      verifiedDate: new (Date),
      comments: '',
      isSelected: false
    };

    switch (insertOption.trim()) {
      case '1': {
        this.tableData.unshift(newRow);
        alert('New Row Added At Beginning! You can now Edit it.');
        break;
      }

      case '2': {
        this.tableData.push(newRow);
        alert('New Row Added At End! You can now Edit it.');
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
            alert(`New Row Added at ${index + 1}! You can now Edit it.`);
          } else {
            alert('Invalid Position!');
          }
        } else {
          return;
        }
        break;
      }

      default:
        alert('Invalid option! Please enter 1, 2, or 3.');
        break;
    }
    this.tableData.forEach((row, index) => {
      row.srNo = index + 1;
    });

    this.updatePaginatedData();
    this.cdr.detectChanges();
  }

  backupColumnsBeforeDeletion() {
    // Backing up the current state of tableColumns and tableData
    localStorage.setItem(
      'tableColumnsBackup',
      JSON.stringify(this.tableColumns)
    );
    localStorage.setItem('tableDataBackup', JSON.stringify(this.tableData));
  }
  async deleteColumn() {
    if (!this.isAdmin()) return;
  
    this.backupColumnsBeforeDeletion();
  
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
          'Enter the exact Header Name of the Column you want to delete:',
          'Column Name',
          ''
        );
        if (colName) {
          this.removeColumns([colName]);
        }
        break;
      }
  
      case 'Delete a Range of Columns': {
        const rangeInput = await this.openInputDialog(
          'Select Range',
          'Enter the Starting and Ending column headers (separated by a hyphen [-]):',
          'Range',
          ''
        );
  
        if (rangeInput) {
          const [startColumn, endColumn] = rangeInput
            .split('-')
            .map((col) => col.trim());
          const startIndex = this.tableColumns.findIndex(
            (col) => col.header.toLowerCase() === startColumn.toLowerCase()
          );
          const endIndex = this.tableColumns.findIndex(
            (col) => col.header.toLowerCase() === endColumn.toLowerCase()
          );
  
          if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
            const columnsToDelete = this.tableColumns
              .slice(startIndex, endIndex + 1)
              .map((col) => col.header);
            this.removeColumns(columnsToDelete);
          } else {
            this.openDialog('Invalid Range of Columns!');
          }
        }
        break;
      }
  
      case 'Delete Multiple Columns': {
        const columnsInput = await this.openInputDialog(
          'Select Multiple Columns',
          'Enter the Column Headers separated by commas (,) to Delete:',
          'Columns',
          ''
        );
  
        if (columnsInput) {
          const columnsToDelete = columnsInput.split(',').map((col) => col.trim());
          this.removeColumns(columnsToDelete);
        }
        break;
      }
  
      default:
        this.openDialog('Invalid Option!');
        break;
    }
  }
  
  removeColumns(columnsToDelete: string[]) {
    const fieldsToDelete: string[] = [];
  
    this.tableColumns = this.tableColumns.filter((col) => {
      if (columnsToDelete.includes(col.header)) {
        fieldsToDelete.push(col.field);
        return false;
      }
      return true;
    });
  
    if (fieldsToDelete.length > 0) {
      this.tableData.forEach((row) => {
        fieldsToDelete.forEach((field) => delete row[field]);
      });
      this.cdr.detectChanges();
      this.openDialog(`Columns "${columnsToDelete.join(', ')}" Deleted Successfully!`);
    } else {
      this.openDialog('No matching columns found to delete.');
    }
  }
  
  saveNewRow() {
    if (!this.isAdmin()) return;

    if (this.editingMode) {
      const requiredFields = this.tableColumns.map((column: { field: any; }) => column.field);

      const inValidRows = this.tableData.filter((row) => {
        return requiredFields.some(
          (field: string | number) => !row[field] || row[field].toString().trim() === ''
        );
      });

      if (inValidRows.length > 0) {
        alert('Please Fill All Missing Fields!');
        return;
      }

      this.editingMode = false;
      this.editingRow = null;
      this.cdr.detectChanges();
      alert('All Rows Saved Successfully!');
    } else {
      this.editingMode = true;
      alert('You can edit rows now. Click "Save" again to finalize changes.');
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
      this.openDialog(`New Column Added: "${newColumn.header}"!`);
    } else {
      this.openDialog('Please Enter Column Name!');
    }
  }

  
  
  saveColumnData(row: TableRow, column: any, event: Event) {
    if (!row || !column || !column.field) {
      alert('Invalid row or column data');
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    if (!inputElement || inputElement.value === undefined) {
      alert('Invalid input element');
      return;
    }

    const newValue = inputElement.value;

    row[column.field] = newValue;

    // this.newColumnAdded = false;
    row[column.field + '_dirty'] = newValue !== '';

    console.log(`Updated column '${column.field}' with value: ${newValue}`);
    alert(`Data for column '${column.header}' Added with value: ${newValue}!`);
  }

  editChange(row: TableRow): void {
    if(!this.isAdmin()) return;

    if (this.editingRow === row) {
      this.editingRow = null;
      alert(`Edited Data Sucessfully!`);
    } else {
      this.editingRow = row;
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

  saveAllColumns(): void {
    if(!this.isAdmin()) return;

    if (this.editingMode) {
      const requiredFields = this.tableColumns.map((colm: { field: any; }) => colm.field);

      const inValidRows = this.tableData.filter((row) => {
        return requiredFields.some((field: string | number) => !row[field] || row[field].toString().trim() === '');
      });

      if (inValidRows.length > 0) {
        alert('Please fill in All Missing Column Data Before Saving!');
        return;
      }

      this.editingMode = false;
      this.cdr.detectChanges();
      alert('All Columns Saved Successfully!')
    } else {
      this.editingMode = true;
      alert('You can Edit All Columns Now! Click "Save All Columns" Again to Finalize Changes.');
    }
  }

// Toggles the 'selected' property for all rows when 'Select All' is checked
toggleSelectAll(): void {
  this.tableData.forEach((row) => (row.isSelected = this.selectAll));
  this.updateSelectedRows();
  this.updatePaginatedData(); // Update pagination after any changes
}

updateSelectAll(): void {
  this.selectAll = this.tableData.every((row) => row.isSelected);
  this.updateSelectedRows();
}

updateSelectedRows(): void {
  this.selectedRows = this.tableData.filter((row) => row.isSelected);
  console.log('Selected Rows:', this.selectedRows);
}


deleteSelectedRows(): void {
  if (!this.isAdmin()) return;

  // Collect selected rows
  const selectedRows = this.tableData.filter((row) => row.isSelected);

  if (selectedRows.length === 0) {
    alert('No rows selected for deletion.');
    return;
  }

  // Confirm deletion
  const confirmDelete = confirm(
    `Are you sure you want to delete ${selectedRows.length} selected row(s)?`
  );
  if (confirmDelete) {
    // Remove selected rows
    this.tableData = this.tableData.filter((row) => !row.isSelected);

    // Reset selection states
    this.selectAll = false;
    this.selectedRows = []; // Clear the selected rows array

    // Update UI and pagination
    this.updatePaginatedData();
    this.cdr.detectChanges();

   // alert('Selected rows deleted successfully!');
  }
}

toggleButtonsVisibility() {
  this.isButtonsVisible = !this.isButtonsVisible;
}

toggleColumnActionsVisibility() {
  this.isColumnActionsVisible = !this.isColumnActionsVisible;
}

saveChanges(): void {
  if (!this.isAdmin()) return;

  // Check if we are in editing mode
  if (this.editingMode) {
    // Validate rows
    const requiredFields = this.tableColumns.map((colm: { field: any; }) => colm.field);
    const invalidRows = this.tableData.filter((row) =>
      requiredFields.some(
        (field: string | number) => !row[field] || row[field].toString().trim() === ''
      )
    );

    if (invalidRows.length > 0) {
      alert('Please fill in all missing data before saving!');
      return;
    }

    // Save changes and exit editing mode
    this.editingMode = false;
    this.editingRow = null;
    this.cdr.detectChanges();
    alert('All changes saved successfully!');
  } else {
    // Enable editing mode
    this.editingMode = true;
    alert('You can now edit rows and columns. Click "Save" again to finalize changes.');
  }
}

}
