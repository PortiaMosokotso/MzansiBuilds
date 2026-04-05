import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { CreateProject } from './pages/create-project/create-project';
import { Projects } from './pages/projects/projects';
import { UpdateProject } from './pages/update-project/update-project';
import { ProjectDetail } from './pages/project-detail/project-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  {path:'create-project', component: CreateProject},
  {path:'projects', component: Projects},
 {path: 'update-project/:id', component: UpdateProject,},
  { path: 'project/:id', component: ProjectDetail },
];