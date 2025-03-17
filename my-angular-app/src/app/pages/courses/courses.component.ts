import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormDataService } from '../../services/form-data.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  imports: [FormsModule, NgIf, NgFor, HttpClientModule] // ✅ Added HttpClientModule
})
export class CoursesComponent {
  formData: { 
    email: string; 
    address: string; 
    imageUrl: string | null;
  } = {
    email: '',
    address: '',
    imageUrl: null
  };
  submittedData: any[] = [];
  currentPage = 1; // Track current page
  itemsPerPage = 5; // Items per page
  totalItems = 0; // Total number of items
  totalPages = 0; // Total number of pages

  constructor(private http: HttpClient, private formDataService: FormDataService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formData.imageUrl = reader.result as string;
      };
    }
  }

  onSubmit() {
    if (this.formData.email && this.formData.address && this.formData.imageUrl) {
      this.http.post('http://localhost:5000/api/submit-form', this.formData)
        .subscribe(response => {
          console.log('✅ Form submitted:', response);
          this.submittedData.push(this.formData);
          this.formData = { email: '', address: '', imageUrl: null }; // Reset form
        }, error => {
          console.error('❌ Submission failed:', error);
        });
    }
  }

  // ngOnInit() {
  //   this.http.get<any[]>('http://localhost:5000/api/form-data')
  //     .subscribe(data => {
  //       this.submittedData = data;
  //     }, error => {
  //       console.error('❌ Error fetching data:', error);
  //     });
  // }
  ngOnInit() {
    this.loadData(this.currentPage); // Load data for the first page
  }
    // Load data for a specific page
    loadData(page: number) {
      this.formDataService.getFormData(page, this.itemsPerPage).subscribe(
        (response) => {
          this.submittedData = response.data;
          this.totalItems = response.total;
          this.totalPages = response.totalPages;
          this.currentPage = page;
        },
        (error) => {
          console.error('❌ Error fetching data:', error);
        }
      );
    }
    // Go to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadData(this.currentPage + 1);
    }
  }

  // Go to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.loadData(this.currentPage - 1);
    }
  }
}
