import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';

export interface MappingRow {
  [key: string]: any;
}

@Component({
  selector: 'app-data-mapping-rule',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './data-mapping-rule.component.html',
  styleUrl: './data-mapping-rule.component.css',
})
export class DataMappingRuleComponent {
  activeTab: string = 'Source to FDS Pre-Stage Mapping Table';



  constructor(private roleService: RoleService) {
    // this.initNewRow();
  }

  tabs = [
    'Source to FDS Pre-Stage Mapping Table',
    'FDS Pre-Stage to FDS Stage Mapping Table',
    'FDS Generated ID TP Mapping Table',
  ];
  tableFormats: { [key: string]: string[] } = {
    'Source to FDS Pre-Stage Mapping Table': [
      'Sr. No.',
      'Source Table',
      'Source Column',
      'Transformation',
      'Comment',
      'FDS Table',
      'FDS Column',
      'Data Type',
      'PK',
      'Nullable',
      'Comment',
    ],
    'FDS Pre-Stage to FDS Stage Mapping Table': [
      'FDS Table',
      'FDS Column',
      'Transformation',
      'Data Type',
      'PK',
      'Nullable',
      'Comment',
      'FDS Stage Table',
      'FDS Stage Column',
      'Data Type',
      'PK',
      'Nullable',
      'Custom',
      'Comment',
    ],
    'FDS Generated ID TP Mapping Table': [
      'Sr. No.',
      'Source Table',
      'Source Column',
      'Transformation',
      'Comment',
      'FDS Table',
      'FDS Column',
      'Data Type',
      'PK',
      'Nullable',
      'Comment',
    ],
  };

  mappingRules: { [key: string]: MappingRow[] } = {
    'Source to FDS Pre-Stage Mapping Table': [
      {
        srNo: 1,
        sourceTable: 'Source1',
        sourceColumn: 'Column1',
        transformation: 'Transform1',
        comment: 'Comment1',
        fdsTable: 'FDS_Table1',
        fdsColumn: 'FDS_Column1',
        dataType: 'VARCHAR',
        pk: 'Yes',
        nullable: 'No',
        fdsComment: 'CommentA'
      }
    ],
    'FDS Pre-Stage to FDS Stage Mapping Table': [
      {
        fdsTable: 'FDS_Table1',
        fdsColumn: 'FDS_Column1',
        transformation: 'Transform2',
        dataType: 'VARCHAR',
        pk: 'Yes',
        nullable: 'No',
        comment: 'CommentB',
        fdsStageTable: 'Stage_Table1',
        fdsStageColumn: 'Stage_Column1',
        stageDataType: 'NUMBER',
        stagePk: 'No',
        stageNullable: 'Yes',
        custom: 'CustomValue',
        stageComment: 'CommentC'
      }
    ],
    'FDS Generated ID TP Mapping Table': [
      {
        srNo: 1,
        sourceTable: 'SourceID1',
        sourceColumn: 'ID_Column1',
        transformation: 'Transform3',
        comment: 'CommentD',
        fdsTable: 'ID_Table1',
        fdsColumn: 'ID_Column2',
        dataType: 'INT',
        pk: 'No',
        nullable: 'Yes',
        fdsComment: 'CommentE'
      }
    ]
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
    this.activeTab = tab;
    // this.initNewRow();
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

  exportToExcel() {
    alert('Exporting data to Excel...');
  }
}
