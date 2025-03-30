import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/home/jobs.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-company-postjobs',
  templateUrl: './company-postjobs.component.html',
  styleUrls: ['./company-postjobs.component.scss']
})
export class CompanyPostjobsComponent implements OnInit {
  companyJobApplications: any[] = [];
  errorMessage: string = '';
  totalJobpostings: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;

  constructor(private jobsService: JobsService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.showCompanyPostJobs();
  }
  updateStatus(jobposting_id: number, event: any) {
    const newStatus = event.target.value;
    this.jobsService.updateJobStatusByAdmin(jobposting_id, newStatus).subscribe(response => {
        if (response.success) {
            alert('Job status updated successfully!');
            this.showCompanyPostJobs();
        } else {
            alert('Failed to update job status');
        }
    }, error => {
        console.error('Error updating job status:', error);
        alert('Something went wrong');
    });
  }

  showCompanyPostJobs(){
    this.jobsService.getJobPosting(this.limit, this.currentPage).subscribe(
      (response:any)=>{
        if(response.success){
          this.companyJobApplications = response.data;
          // console.log(this.companyJobApplications);
          this.totalJobpostings = response.totalJobpostings;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
          this.companyJobApplications.forEach(job=>{
            job.dateposted = this.datePipe.transform(job.dateposted, 'yyyy-MM-dd')
          })
          this.companyJobApplications.forEach(job=>{
            job.expiredate = this.datePipe.transform(job.expiredate, 'yyyy-MM-dd');
          });
          // console.log(this.companyJobApplications);
        }else{
          console.error("Failed to fetch company post jobs");
          this.errorMessage = "Failed to load company post jobs";
        }
      },
      (error)=>{
        console.error("Error fetching company post jobs: ",error);
      }
    )
  }
  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.showCompanyPostJobs();
    }
  }
  deleteJobByAdmin(jobposting_id: number) {
    if (confirm("Are you sure you want to delete this job posting?")) {
        this.jobsService.deleteJobPostingByAdmin(jobposting_id).subscribe(response => {
            if (response.success) {
                alert("Job posting deleted successfully!");
                this.showCompanyPostJobs();
            } else {
                alert("Failed to delete job posting.");
            }
        }, error => {
            console.error("Error deleting job posting:", error);
            alert("Something went wrong.");
        });
    }
  }

}
