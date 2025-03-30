import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/home/jobs.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
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
