import { Component } from '@angular/core';
import { NgFor, NgIf, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormDataService } from '../../../services/form-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [NgFor, NgIf, JsonPipe, FormsModule],
  providers: [FormDataService],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  submittedData: any[] = [];
  editingPost: any = null;
  previewImageUrl: string | null = null;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  searchTerm = '';

  constructor(private formDataService: FormDataService, private router: Router) {}

  ngOnInit(): void {
    this.loadData(this.currentPage);
  }

  loadData(page: number): void {
    console.log('Fetching data for page:', page);

    this.formDataService.getFormData(page, this.itemsPerPage).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.submittedData = response?.data || [];
        this.totalItems = response?.total || 0;
        this.totalPages = response?.totalPages || 0;
        this.currentPage = page;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }

  deletePost(id: string): void {
    this.formDataService.deleteFormData(id).subscribe(() => {
      alert('Post deleted successfully');
      this.loadData(this.currentPage);
    });
  }

  get filteredPosts(): any[] {
    if (!this.submittedData || this.submittedData.length === 0) {
      return [];
    }
    if (!this.searchTerm.trim()) {
      return this.submittedData;
    }

    return this.submittedData.filter((post) =>
      post.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      post.address?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result; // Show preview before uploading
      };
      reader.readAsDataURL(file);
      this.editingPost.newImage = file; // Store the file for upload
    }
  }

  toggleEdit(post: any): void {
    if (this.editingPost?._id !== post._id) {
      this.editingPost = { ...post };
      this.previewImageUrl = null;
    } else {
      const formData = new FormData();
      formData.append('email', this.editingPost.email);
      formData.append('address', this.editingPost.address);

      if (this.editingPost.newImage) {
        formData.append('image', this.editingPost.newImage);
      }

      this.formDataService.updateFormData(this.editingPost._id, formData).subscribe({
        next: () => {
          alert('Post updated successfully');
          Object.assign(post, this.editingPost);
          post.imageUrl = this.previewImageUrl || post.imageUrl;
          this.editingPost = null;
          this.previewImageUrl = null;
        },
        error: (error) => {
          console.error('Error updating post:', error);
          alert('Failed to update post');
        },
      });
    }
  }

  cancelEdit(): void {
    this.editingPost = null;
    this.previewImageUrl = null;
  }

  navigateToMedia() {
    this.router.navigate(['/dashboard/media']);
  }
}
