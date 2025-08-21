import { Component } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-inbox',
  imports: [DatePipe, CommonModule],
  templateUrl: './inbox.html',
  styleUrl: './inbox.scss',
})
export class Inbox {
  requests: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.apiService.getApproverRequests().subscribe({
      next: (res: any) => {
        this.requests = res;
      },
      error: (err) => {
        console.error('Error fetching requests', err);
      },
    });
  }

  updateStatus(requestId: string, status: 'approved' | 'rejected') {
    if (status === 'approved') {
      this.apiService.approveRequest(requestId).subscribe({
        next: () => {
          this.requests = this.requests.map((req) =>
            req.id === requestId ? { ...req, status, decided_at: new Date().toISOString() } : req
          );
        },
        error: (err: any) => {
          console.error(`Error updating status: ${status}`, err);
        },
      });
    } else {
      this.apiService.rejectRequest(requestId).subscribe({
        next: () => {
          this.requests = this.requests.map((req) =>
            req.id === requestId ? { ...req, status, decided_at: new Date().toISOString() } : req
          );
        },
        error: (err: any) => {
          console.error(`Error updating status: ${status}`, err);
        },
      });
    }
  }
}
