import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobsService } from 'src/app/home/jobs.service';

@Component({
  selector: 'app-company-header',
  templateUrl: './company-header.component.html',
  styleUrls: ['./company-header.component.scss']
})
export class CompanyHeaderComponent implements OnInit {
  isCompanyLoggedIn: boolean = false;

  constructor(private jobsService: JobsService, private router: Router) { }

  ngOnInit(): void {
    this.isCompanyLoggedIn = this.jobsService.isCompanyLoggedIn();
  }
  logout(){
    this.jobsService.logoutCompany().subscribe(
      (response)=>{
        this.jobsService.setCompanyLoggedIn(false);
        this.jobsService.clearCompanyLoginState();
        this.isCompanyLoggedIn = false;
        this.router.navigate(['/home/login']);
      },
      (error) => {
        console.error('Logout failed', error);
      });

  }

}
