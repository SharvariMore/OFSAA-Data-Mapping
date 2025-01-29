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
    FormsModule,
    CommonModule,
    MatCheckboxModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  selectedOptions: { [key: string]: boolean } = {};
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
      selectedOption?: string | string[];
      useCheckboxes?: boolean;
    }
  ) {
    if (this.data.options && this.data.useCheckboxes) {
      this.data.options.forEach((option) => {
        this.selectedOptions[option] = false; // Initialize all options as unselected
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  // onConfirm(): void {
  //   this.dialogRef.close(this.data.inputValue);
  // }
  onConfirm(): void {
    if (this.data.input) {
      // Return the input value if the input field is displayed
      this.dialogRef.close(this.data.inputValue);
    } else if (this.data.selectLabel && !this.data.useCheckboxes){
      // Return the selected option if the select dropdown is displayed
      this.dialogRef.close(this.data.selectedOption);
    } else if (this.data.useCheckboxes) {
      // Return the selected options if checkboxes are used
      const selectedStages  = this.data.options
        ? this.data.options.filter((option) => this.selectedOptions[option])
        : [];
      this.dialogRef.close(selectedStages);
    } else {
      this.dialogRef.close(true);
    }
  }
}
