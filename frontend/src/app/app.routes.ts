import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { CreateProject } from './pages/create-project/create-project';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  {path:'create-project',component:CreateProject}
];