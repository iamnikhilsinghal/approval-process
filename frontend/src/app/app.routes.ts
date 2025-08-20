import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { RequestForm } from './components/request-form/request-form';
import { MyRequests } from './components/my-requests/my-requests';
import { Inbox } from './components/inbox/inbox';
import { AdminUsers } from './components/admin-users/admin-users';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Dashboard },
  { path: 'new-request', component: RequestForm },
  { path: 'my-requests', component: MyRequests },
  { path: 'approver-inbox', component: Inbox },
  { path: 'admin-users', component: AdminUsers },
];
