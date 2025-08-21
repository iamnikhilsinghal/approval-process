import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private router: Router) {}

  BASE_URL = 'http://localhost:8080/requests';

  createRequest(reqData: any) {
    return this.http.post(`${this.BASE_URL}`, reqData);
  }

  getApproverRequests() {
    return this.http.get(`${this.BASE_URL}/approver-request-list`);
  }

  approveRequest(requestId: string) {
    return this.http.post(`${this.BASE_URL}/${requestId}/approve`, {});
  }

  rejectRequest(requestId: string) {
    return this.http.post(`${this.BASE_URL}/${requestId}/reject`, {});
  }

  getAdminRequests() {
    return this.http.get(`${this.BASE_URL}/admin-request-list`);
  }
}
