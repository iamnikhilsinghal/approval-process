import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private router: Router) {}

  BASE_URL = 'http://localhost:8080/requests';

  createRequest(reqData: { categoty_id: string; title: string; description: string }) {
    return this.http.post(`${this.BASE_URL}`, reqData);
  }
}
