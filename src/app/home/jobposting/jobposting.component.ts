import { Component, OnInit } from '@angular/core';
import { JobsService } from '../jobs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-jobposting',
  templateUrl: './jobposting.component.html',
  styleUrls: ['./jobposting.component.scss']
})
export class JobpostingComponent implements OnInit {
  jobPosting: any[] = [];
  postingId!: number;
  currentUser: any = null;
  jobPostingLoaded: boolean = false;

  constructor(private jobsService: JobsService, private route: ActivatedRoute, private router: Router,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.postingId = +this.route.snapshot.paramMap.get('postingId')!;
    // this.fetchJobposting();
    this.fetchCurrentUser();
  }
  fetchCurrentUser(): void {
    this.jobsService.getCurrentuser().subscribe(
      (response: any) => {
        if (response && response.user) {
          this.currentUser = response.user;
          this.currentUser.user_registerid = response.user.user_registerid;
          this.fetchJobposting(); 
        } else {
          console.warn('User is not logged in');
          this.currentUser = null;
          this.fetchJobposting(); 
        }
      },
      (error) => {
        if (error.status === 401) { 
          console.warn('User is not authenticated');
          this.currentUser = null; 
          this.fetchJobposting(); 
        } else {
          console.error('Failed to fetch current user:', error);
        }
      }
    );
  }
  fetchJobposting(): void {
    this.jobPostingLoaded = false;
    this.jobsService.getJobpostingBySubcategories(this.postingId, 10, 0).subscribe((response) => {
      if(response.success){
        // this.jobPosting = response.data;
        // console.log(this.jobPosting);
        this.jobPosting = response.data.map((job: any) => ({
          ...job,
          isApplied: false
        }));
        this.jobPosting.forEach(job=>{
          job.dateposted = this.datePipe.transform(job.dateposted, 'yyyy-MM-dd');
        });
        this.jobPosting.forEach(jobs=>{
          jobs.expiredate = this.datePipe.transform(jobs.expiredate, 'yyyy-MM-dd');
        })
        this.checkAppliedJobs();
      }
    });
  }
  checkAppliedJobs(): void {
    // if (!this.currentUser?.user_registerid) return;
    if (!this.currentUser?.user_registerid) {
      this.jobPostingLoaded = true; 
      return;
    }


    this.jobsService.checkApplicationStatus(this.currentUser.user_registerid).subscribe(
      (response) => {
        if (response.success) {
          const appliedJobs = response.appliedJobs;
          this.jobPosting.forEach(job => {
            if (appliedJobs.includes(job.jobposting_id)) {
              job.isApplied = true;
            }
          });
        }
        this.jobPostingLoaded = true;
      },
      (error) => {
        console.error('Error checking application status:', error);
      }
    );
  }
  applyForJob(jobId: number): void{
    if (!this.currentUser || !this.currentUser.user_registerid){
      alert("Please log in to apply for the job.");
      this.router.navigate(['/home/login']);
      return;
    }
    this.jobsService.applyForJob(this.currentUser.user_registerid, jobId).subscribe(
      (response) => {
        if(response.success) {
          alert('Job application submitted successfully!');
          const appliedJob = this.jobPosting.find(job => job.jobposting_id === jobId);
          if (appliedJob){
            appliedJob.isApplied = true;
          }
        } else {
          alert('Failed to apply for job: ' + response.message);
        }
      },
      (error) => {
        alert('Error occurred: ' + error.error.message);
      }
    )
  }
}