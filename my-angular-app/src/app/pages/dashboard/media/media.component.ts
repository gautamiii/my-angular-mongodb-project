import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-media',
  standalone: true,
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  imports: [FormsModule, NgIf, NgFor, HttpClientModule] // ✅ Added HttpClientModule
})
export class MediaComponent {
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
  successMessage: string | null = null; // ✅ Success message state
  currentPage = 1; 
  itemsPerPage = 5; 
  totalItems = 0; 
  totalPages = 0; 

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

          // ✅ Show success message
          this.successMessage = "🎉 Form submitted successfully!";

          setTimeout(() => {
            this.successMessage = null;
          }, 3000);

          this.formData = { email: '', address: '', imageUrl: null }; // Reset form
        // Reset file input field
        const fileInput = document.getElementById("exampleFormControlFile1") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ""; // Clear file input
        }
      }, error => {
        console.error('❌ Submission failed:', error);
      });
    }
  }




}
