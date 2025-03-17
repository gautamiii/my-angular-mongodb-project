import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ✅ This makes it available throughout the app
})
export class FormDataService {
  private apiUrl = 'http://localhost:5000/api/form-data'; // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  // Fetch data from MongoDB
  // getFormData(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }
  // Fetch data with pagination
  getFormData(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }
  // Save form data to MongoDB
  saveFormData(newData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, newData);
  }

  deleteFormData(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-data/${id}`);
  }

  // ✅ Update Form Data
updateFormData(id: string, updatedData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/update-form/${id}`, updatedData);
}

}
