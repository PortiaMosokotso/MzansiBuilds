import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../services/project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  projects: any[] = [];
  loading = true;
  error = false;
  editingStageId: number | null = null;

  stages = [
    { key: 0, label: 'Planning',    color: 'planning'  },
    { key: 1, label: 'In Progress', color: 'progress'  },
    { key: 2, label: 'Testing',     color: 'testing'   },
    { key: 3, label: 'Completed',   color: 'completed' },
  ];

  stageMap: { [key: number]: string } = {
    0: 'Planning',
    1: 'In Progress',
    2: 'Testing',
    3: 'Completed',
  };

  stageColors: { [key: number]: string } = {
    0: 'planning',
    1: 'progress',
    2: 'testing',
    3: 'completed',
  };

  constructor(
    private projectService: Project,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.error = false;
    this.projectService.getAllProjects().subscribe({
      next: (response: any) => {
        this.projects = Array.isArray(response) ? response : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
      },
    });
  }
  
  goToCreateProject() {
    this.router.navigate(['/create-project']);}

  editProject(projectId: number): void {
    this.router.navigate(['/update-project', projectId]);
  }
  viewProject(projectId: number): void {
  this.router.navigate(['/project', projectId]);
}
  getProjectsByStage(stageKey: number): any[] {
    return this.projects.filter(p => p.stage === stageKey);
  }

  getStageName(stage: number): string {
    return this.stageMap[stage] ?? 'Unknown';
  }

  getStageClass(stage: number): string {
    return this.stageColors[stage] ?? 'planning';
  }

  toggleStageEdit(projectId: number): void {
    this.editingStageId = this.editingStageId === projectId ? null : projectId;
  }

  changeStage(project: any, newStage: number): void {
    project.stage = Number(newStage);
    this.editingStageId = null;
    this.cdr.detectChanges();

    // Call your API to persist the change
    this.projectService.updateProjectStage(project.id, newStage).subscribe({
      next: () => console.log('Stage updated'),
      error: (err) => console.error('Failed to update stage', err)
    });
  }

  get totalProjects(): number {
    return this.projects.length;
  }

  get completedProjects(): number {
    return this.projects.filter(p => p.stage === 3).length;
  }

  get needsSupport(): number {
    return this.projects.filter(p => p.supportRequired).length;
  }

  deleteProject(projectId: number): void {
  if (!confirm('Are you sure you want to delete this project?')) return;

  this.projectService.deleteProject(projectId).subscribe({
    next: () => {
      // Remove deleted project from local array to update UI
      this.projects = this.projects.filter(p => p.id !== projectId);
      console.log('Project deleted successfully');
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to delete project', err);
      alert('Failed to delete project.');
    }
  });
}
}