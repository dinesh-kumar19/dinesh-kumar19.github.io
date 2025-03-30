import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/home/jobs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.scss']
})
export class AdminDetailsComponent implements OnInit {
  isAdminLoggedIn: boolean = false;

  constructor(private jobsService: JobsService, private router: Router) { }

  ngOnInit(): void {
    this.isAdminLoggedIn = this.jobsService.isAdminLoggedIn();
  }
  logout(): void{
    this.jobsService.logoutAdmin().subscribe(
      (response)=>{
        this.jobsService.setAdminLoggedIn(false);
        this.jobsService.clearAdminLoginState();
        this.isAdminLoggedIn = false;
        this.router.navigate(['/admin/CLadmin']);
      },
      (error) => {
        console.error('Logout failed', error);
      });
  }
  

}
