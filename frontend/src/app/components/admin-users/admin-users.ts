import { Component } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers {
  requestList: any = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getAdminRequests().subscribe((resp) => {
      console.log('resp', resp);
      this.requestList = resp;
    });
  }

  isValidUrl(req: any) {
    req.document_url.match(/\.(jpeg|jpg|png|gif)$/i);
  }
}
