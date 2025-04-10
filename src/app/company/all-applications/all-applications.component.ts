import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/home/jobs.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-all-applications',
  templateUrl: './all-applications.component.html',
  styleUrls: ['./all-applications.component.scss'],
  providers: [DatePipe]
})
export class AllApplicationsComponent implements OnInit {
  userAppliedJobs : any[] = [];
  company_id! : number;
  errorMessage: string = '';
  totalApplicationsByCompany: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;

  constructor(private jobsService: JobsService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loadCurrentCompany();
  }
  loadCurrentCompany(){
    this.jobsService.getCurrentCompany().subscribe(
      (response: any)=>{
        this.company_id = response.company.company_id;
        // console.log(this.company_id);
        if(this.company_id){
            this.getUserAppliedJobs();
          }else{
            console.error("Company ID not found");
          }
      },
      (error)=>{
        console.error("Error fetching current company:",error);
      }
    )
  }
  getUserAppliedJobs() {
    this.jobsService.getApplicationsByCompany(this.company_id, this.limit, this.currentPage).subscribe(
      (res: any) => {
        if (res.success) {
          this.totalApplicationsByCompany = res.totalapplicationsByCompany;   
          this.totalPages = res.totalPages;
          this.currentPage = res.currentPage;
          this.userAppliedJobs = res.data.map((job: any) => {
            if (job.application_date) {
              job.application_date = this.datePipe.transform(job.application_date, 'yyyy-MM-dd');
            }
            if (job.resume_path) {
              job.resume_path = `https://careerlink-jobportal-backend-production.up.railway.app/uploads/resumes/${job.resume_path}`;
            }
            return job;
          });
        } else {
          console.error("Failed to fetch user applied jobs");
          this.errorMessage = "Failed to load user applied jobs";
        }
      },
      (error) => {
        console.error("Error fetching user applied jobs:", error);
      }
    );
  }
  
  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.getUserAppliedJobs();
    }
  }
  updateJobStatus(job_applicationID: number, event: Event){
    const newStatus = (event.target as HTMLSelectElement).value;
    this.jobsService.updateJobApplicationStatus(job_applicationID,newStatus).subscribe(
      (res:any)=>{
        if(res.success){
          alert("job status updated successfully");
          const job = this.userAppliedJobs.find(job => job.job_applicationID === job_applicationID);
        if (job) {
          job.job_status = newStatus;
        }
          // this.getUserAppliedJobs();
        }else{
          console.error("Failed to update job status");
        }
      },
      (error)=>{
        console.error("Error updating job status", error);
      }
    )
  }
  deleteApplication(job_applicationID: number) {
    if (confirm('Are you sure you want to delete this application?')) {
      this.jobsService.deleteJobApplicationByCompany(job_applicationID).subscribe(response => {
        if (response.success) {
          alert('Job application deleted successfully!');
          this.getUserAppliedJobs();
        } else {
          alert('Failed to delete application');
        }
      }, error => {
        console.error('Error deleting application:', error);
        alert('Something went wrong');
      });
    }
  }
}
