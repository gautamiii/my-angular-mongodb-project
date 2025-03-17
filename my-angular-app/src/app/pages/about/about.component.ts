import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormDataService } from '../../services/form-data.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgFor],
  providers: [FormDataService],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  submittedData: any[] = [];
  currentPage = 1; // Track current page
  itemsPerPage = 5; // Items per page
  totalItems = 0; // Total number of items
  totalPages = 0; // Total number of pages

  constructor(private formDataService: FormDataService) {}

  ngOnInit(): void {
    this.loadData(this.currentPage); // Load data for the first page
  }
  // Load data for a specific page
  loadData(page: number): void {
    this.formDataService.getFormData(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.submittedData = response.data;
        this.totalItems = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = page;
      },
      error: (error) => {
        console.error('❌ Error fetching data:', error);
      },
    });
  }

    // Go to the next page
    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.loadData(this.currentPage + 1);
      }
    }
  
    // Go to the previous page
    previousPage(): void {
      if (this.currentPage > 1) {
        this.loadData(this.currentPage - 1);
      }
    }

  onDelete(id: string, index: number): void {
    console.log("Deleting ID:", id); // ✅ Check if the correct ID is logged
    this.formDataService.deleteFormData(id).subscribe({
      next: () => {
        console.log('✅ Data deleted successfully');
        this.submittedData.splice(index, 1); // Remove from UI
      },
      error: (error) => {
        console.error('❌ Error deleting data:', error);
      }
    });
  }
}
