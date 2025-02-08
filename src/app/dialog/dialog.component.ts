import { MatInputModule } from '@angular/material/input';
import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  useCheckboxes: boolean = false; // Default to dropdown
  selectedOptions: string[] = []; // For storing multiple selected options when checkboxes are used
  selectedOption: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      input?: boolean;
      inputLabel?: string;
      inputValue?: string;
      selectLabel?: string; // Optional label for the select dropdown
      options?: string[]; // List of options for the select dropdown
      selectedOption?: string;
      selectedTables?: string[];
      useCheckboxes?: boolean;
    }
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    // Now safely access this.data and initialize useCheckboxes
    if (this.data && this.data.useCheckboxes !== undefined) {
      this.useCheckboxes = this.data.useCheckboxes; // Initialize based on passed data
    }

    if (this.useCheckboxes && this.data?.selectedTables) {
      this.selectedOptions = [...this.data.selectedTables]; // Set selected tables (pre-selected)
    } else if (!this.useCheckboxes && this.data?.selectedOption) {
      this.selectedOption = this.data.selectedOption; // Set selected option for dropdown
    }
  }

  toggleSelection(option: string, event: any): void {
    if (event.checked) {
      // If checkbox is checked, add option to selectedOptions
      this.selectedOptions.push(option);
    } else {
      // If checkbox is unchecked, remove option from selectedOptions
      const index = this.selectedOptions.indexOf(option);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  // onConfirm(): void {
  //   this.dialogRef.close(this.data.inputValue);
  // }
  onConfirm(): void {
    if (this.useCheckboxes) {
      // Return the array of selected options when checkboxes are used
      this.dialogRef.close(this.selectedOptions);
    } else if (this.data.input) {
      // Return the input value if the input field is displayed
      this.dialogRef.close(this.data.inputValue);
    } else if (this.data.selectLabel) {
      // Return the selected option if the select dropdown is displayed
      this.dialogRef.close(this.data.selectedOption);
    } else {
      this.dialogRef.close(true);
    }
  }
}
