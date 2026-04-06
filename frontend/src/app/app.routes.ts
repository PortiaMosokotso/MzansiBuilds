import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { CreateProject } from './pages/create-project/create-project';
import { Projects } from './pages/projects/projects';
import { UpdateProject } from './pages/update-project/update-project';
import { ProjectDetail } from './pages/project-detail/project-detail';
import { authGuard } from './guards/auth-guard';
import { CelebrationWall } from './pages/celebration-wall/celebration-wall';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'create-project', component: CreateProject, canActivate: [authGuard] },
  { path: 'projects', component: Projects, canActivate: [authGuard] },
  { path: 'update-project/:id', component: UpdateProject, canActivate: [authGuard] },
  { path: 'project/:id', component: ProjectDetail, canActivate: [authGuard] },
  { path: 'celebration-wall', component: CelebrationWall },
];