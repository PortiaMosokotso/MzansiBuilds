import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Project } from '../../services/project';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProject {
  title = '';
  description = '';
  stage = 0;
  supportRequired = false;
  supportDetails = '';

  constructor(
    private projectService: Project,
    private router: Router
  ) {}

  createProject() {
    const payload = {
      title: this.title,
      description: this.description,
      stage: this.stage,
      supportRequired: this.supportRequired,
      supportDetails: this.supportDetails
    };

    this.projectService.createProject(payload).subscribe({
      next: () => {
        alert('Project created successfully!');
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        alert(err.error);
      }
    });
  }
   cancel(): void {
    this.router.navigate(['/projects']);
  }
}
