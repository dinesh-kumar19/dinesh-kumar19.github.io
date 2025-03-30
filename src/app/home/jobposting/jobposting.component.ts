import { Component, OnInit } from '@angular/core';
import { JobsService } from '../jobs.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private jobsService: JobsService, private route: ActivatedRoute, private router: Router) { }

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
          this.fetchJobposting(); // Fetch job postings even if user is not logged in
        } else {
          console.error('Failed to fetch current user:', error);
        }
      }
    );
  }
  
  // fetchCurrentUser(): void {
  //   this.jobsService.getCurrentuser().subscribe(
  //     (response: any) => {
  //       this.currentUser = response.user;
  //       this.currentUser.user_registerid = response.user.user_registerid;
  //       this.fetchJobposting();
  //       // console.log("user registerID : ",this.currentUser.id);
  //     },
  //     (response)=>{
  //       if(response.success){
  //         this.currentUser.user_registerid = response.data.user_registerid;
  //         // console.log("user register : ",this.currentUser.id);
  //       }else{
  //         console.error("Failed to fetch current user");
  //       }
  //     },
  //   );  
  // }
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
        this.checkAppliedJobs();
      }
    });
  }
  // checkAppliedJobs():void {
  //   if(!this.currentUser?.id) return;

  //   this.jobPosting.forEach(job =>{
  //     this.jobsService.checkApplicationStatus(this.currentUser.id, job.jobposting_id)
  //       .subscribe(response => {
  //         if (response.success && response.applied) {
  //           job.isApplied = true;
  //         }
  //       });
  //   });
  // }
  checkAppliedJobs(): void {
    // if (!this.currentUser?.user_registerid) return;
    if (!this.currentUser?.user_registerid) {
      this.jobPostingLoaded = true; // Mark as loaded even if no user is logged in
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