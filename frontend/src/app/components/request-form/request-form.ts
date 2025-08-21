import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-form.html',
  styleUrls: ['./request-form.scss'],
})
export class RequestForm {
  requestForm: FormGroup;
  selectedFile: File | null = null;

  // get it by API
  categories = [
    { id: 'e3f0b37c-9dd4-4f65-a50a-0f5379e7e3d8', name: 'Management Approval Note' },
    { id: 'b7d0f47d-84a2-4a13-bf60-123456789abc', name: 'Category B' },
    { id: 'c2f6d83a-1111-4a67-9f22-987654321def', name: 'Category C' },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private apiService: ApiService) {
    this.requestForm = this.fb.group({
      categoty_id: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('categoty_id', this.requestForm.value.categoty_id!);
    formData.append('title', this.requestForm.value.title!);
    formData.append('description', this.requestForm.value.description!);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.apiService.createRequest(formData).subscribe({
      next: (res) => {
        console.log('Request created:', res);
        alert('Request submitted successfully ✅');
        this.requestForm.reset();
      },
      error: (err) => {
        console.error('Error creating request:', err);
        alert('Something went wrong ❌');
      },
    });
  }
}
