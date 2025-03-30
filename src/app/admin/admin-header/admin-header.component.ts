import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobsService } from 'src/app/home/jobs.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
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
