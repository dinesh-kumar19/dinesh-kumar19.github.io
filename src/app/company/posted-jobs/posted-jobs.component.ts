import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/home/jobs.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-posted-jobs',
  templateUrl: './posted-jobs.component.html',
  styleUrls: ['./posted-jobs.component.scss'],
  providers: [DatePipe]
})
export class PostedJobsComponent implements OnInit {
  activePostedJobs : any[] = [];
  company_id: number | null = null;
  totalActiveJobs: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;

  constructor(private jobsService: JobsService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getLoggedInCompany();
  }
  getLoggedInCompany(){
    this.jobsService.getCurrentCompany().subscribe(
      (response:any)=>{
        if(response.company) {
        this.company_id = response.company.company_id;
        this.getActiveJobsByCompany();
      } else {
        console.log("No company ID found or invalid response:", response);
      }
    }, (error) => {
      console.error("Error fetching company ID:", error);
    }
  );
  }
  getActiveJobsByCompany(){
    if(this.company_id !== null)
    this.jobsService.getActiveJobsByCompany(this.company_id, this.limit, this.currentPage).subscribe(
      (response:any)=>{
        if(response.success && response.data){
          this.activePostedJobs = response.data;
          this.totalActiveJobs = response.totalActiveJobs;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
          this.activePostedJobs.forEach(activeJobs=>{
            activeJobs.expiredate = this.datePipe.transform(activeJobs.expiredate, 'yyyy-MM-dd');
          });
          console.log("Active posted jobs:", this.activePostedJobs)
        }else {
          console.log("No active jobs found or invalid response:", response);
        }
      },
      (error) => {
        console.error("Error fetching jobs:", error);
      }
    );
  }
  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.getActiveJobsByCompany();
    }
  }
  deleteJob(jobposting_id: number) {
    if (confirm("Are you sure you want to delete this job posting?")) {
      this.jobsService.deleteJobPostingByCompany(jobposting_id).subscribe(response => {
        if (response.success) {
          alert('Job deleted successfully!');
          this.getActiveJobsByCompany();
        }
      },
      error => {
        console.error("Delete Error:", error);
        alert("Error deleting job. Check console for details.");
      }
    );
    }
  }
}
