import { Component } from '@angular/core'; 
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  activeTab: 'dashboard' | 'projects' = 'dashboard'; 

  constructor(private router: Router) {}

  goToCreateProject() {
    this.router.navigate(['/create-project']);
  }

  goTo(tab: 'dashboard' | 'projects') {
    this.activeTab = tab;
    this.router.navigate([tab === 'dashboard' ? '/dashboard' : '/projects']);
  }
}
