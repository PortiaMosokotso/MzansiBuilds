import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Project } from '../../services/project';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  projects: any[] = [];
  loading = true;
  error = false;

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

  constructor(private projectService: Project, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.error = false;
    this.projectService.getAllProjects().subscribe({
      next: (response: any) => {
        console.log('Projects loaded:', response);
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

  getStageName(stage: number): string {
    return this.stageMap[stage] ?? 'Unknown';
  }

  getStageClass(stage: number): string {
    return this.stageColors[stage] ?? 'planning';
  }
}