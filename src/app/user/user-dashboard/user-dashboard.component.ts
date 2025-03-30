import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobsService } from 'src/app/home/jobs.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  currentUser: any = {};
  user_id! : number;
  userJobs: any[]= [];
  errorMessage: string = '';
  totalApplicationsByUser: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;


  constructor(private jobsService: JobsService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.jobsService.getCurrentuser().subscribe(
      (response: any) => {
        this.currentUser = response.user;
        this.user_id = this.currentUser.user_registerid;
        // console.log(this.currentUser.user_registerid);
        // console.log(this.user_id);
        if(this.user_id){
          this.getJobsByUser();
        }else{
          console.error("User ID no found");
        }
      },
      (error) => {
        console.log('Failed to fetch user data', error);
      },
    );
  }
  getJobsByUser(){
    this.jobsService.getApplicationsByUser(this.user_id, this.limit, this.currentPage).subscribe(
      (response: any) => {
        if(response.success){
          this.userJobs = response.data.map((application:any) => ({
            ...application,
            isRejected: application.job_status === 'Rejected'
          }));
          this.totalApplicationsByUser = response.totalApplicationsByUser;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
          // console.log(this.userJobs);
          this.userJobs.forEach(applicationDate =>{
            applicationDate.application_date = this.datePipe.transform(applicationDate.application_date, 'yyyy-MM-dd');
          });
        }else{
          console.error("Failed to fetch individual user applications");
          this.errorMessage = "Failed to load user applied jobs";
        }
      },
      (error)=>{
        console.error("Error fetching individual user applications", error);
      }
    )
  }
  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.getJobsByUser();
    }
  }
  deleteUserApplication(job_applicationID: number){
    if(confirm('Are you sure you want to delete this job application?')){
      this.jobsService.deleteUserApplication(job_applicationID,this.user_id).subscribe(
        (response: any)=>{
          if(response.success){
            alert('Application deleted successfully.');
            this.getJobsByUser();
          }else{
            alert('Failed to delete application.');
          }
        },
        (error)=>{
          console.error('Error deleting application:',error);
          alert("An error occured while deleting.");
        }
      );
    }
  }
}
