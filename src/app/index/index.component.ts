import { ChangeDetectorRef, Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableRow {
  [key: string]: string | number | boolean; // Allow dynamic keys
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
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
[x: string]: any;
  searchText: string = '';
  newColumnName: string = '';
  editingRow: TableRow | null = null;  // Keeps track of the currently edited row

  statusOptions: string[] = ['Not Started', 'In Progress', 'Complete'];
  usedInOptions = ['Y', 'N'];

  tableData: TableRow[] = [
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

  tableColumns = [
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
    { header: 'Used in AXIOM', field: 'usedInAXIOM' }
  ];


  constructor(private roleService: RoleService, private cdr: ChangeDetectorRef) {}

  isAdmin(): boolean {
    return this.roleService.getRole() === 'admin';
  }

  filteredData() {
    if(!this.searchText) return this.tableData;

    return this.tableData.filter((row) =>
      Object.values(row).some((val) =>
        val.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

  addData() {
    if(!this.isAdmin()) return;

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
      usedInAXIOM: 'N'
    };
    this.tableData.push(newRow);
  }

  addColumn() {
    if(!this.isAdmin()) return;

    console.log("New Column Name: ", this.newColumnName);

    if (this.newColumnName.trim() !== '') {
      const newColumn = {
        header: this.newColumnName,
        field: this.newColumnName.replace(/\s+/g, '').toLowerCase()
      };
      this.tableColumns.push(newColumn);

      //add new column to table with empty value
      this.tableData.forEach(row => {
        row[newColumn.field] = '';
      });

      this.cdr.detectChanges();

      this.newColumnName = '';
    } else {
      alert('Please Enter Column Name!')
    }
  }

  editData(row: TableRow): void {
    if(!this.isAdmin()) return;

    if (this.editingRow === row) {
      //save changes and exit
      this.editingRow = null;
      alert(`Edited Data Sucessfully!`);
    } else {
      //enable edit mode
      this.editingRow = row;
    }
  }

  isEllipsisActive(element: HTMLElement): boolean {
    if (!element) return false;
    return element.offsetWidth < element.scrollWidth;
  }
}
