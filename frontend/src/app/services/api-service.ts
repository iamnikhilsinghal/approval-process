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

  getAdminRequests() {
    return this.http.get(`${this.BASE_URL}/admin-request-list`);
  }
}
