import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobsService } from 'src/app/home/jobs.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  loggedUser: any = {};
  profileImage: SafeUrl = 'assets/profile/profile_pic.png';
  resumeUrl: string = '';  
  resumeFileName: string = 'No resume upload';
  newResumeSelected: boolean = false;
  newResumeUrl: SafeUrl | null = null;
  profileForm!: FormGroup; 
  formValue:any;
  selectedProfileImage: File | null = null;
  selectedResume: File | null = null;

  constructor(private router: Router, private jobsService: JobsService, private http: HttpClient,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.userProfileForm();
    this.getUserDetails();
    
  }
  userProfileForm(){
    this.profileForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email_id: new FormControl('', [Validators.required, Validators.email]),
        phone_no: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
        location: new FormControl('', Validators.required),
      }
    );
  }
  // getFileName(url: string): string {
  //   if (!url) return '';  
  //   return url.split('/').pop() || ''; 
  // }
  getUserDetails(){
    this.jobsService.getCurrentuser().subscribe(
      (response: any)=>{
        this.loggedUser = response.user;

        if(this.loggedUser.resume_path){
          this.resumeUrl = `http://localhost:3000/uploads/resumes/${this.loggedUser.resume_path}`;
          this.resumeFileName = this.getFileName(this.resumeUrl);
        } else {
          this.resumeUrl = '';
          this.resumeFileName = 'No resume uploaded';
        }
        this.profileForm.patchValue({
          name: this.loggedUser.name || '',
          email_id: this.loggedUser.email_id || '',
          phone_no: this.loggedUser.phone_no || '',
          location: this.loggedUser.location || '',
          profileImage: this.loggedUser.user_profile || '', 
          resumeUrl: this.resumeUrl || '' 
        });
        if (this.loggedUser.user_profile && this.loggedUser.user_profile.trim() !== '' && 
          this.loggedUser.user_profile !== 'default.jpg') {
            this.profileImage = `https://careerlink-jobportal-backend-production.up.railway.app/uploads/user_Profiles/${this.loggedUser.user_profile}`;
        } else {
            this.profileImage = 'assets/profile/profile_pic.png'; 
        }

        if(this.loggedUser.resume_path){
          this.loggedUser.resume_path = `https://careerlink-jobportal-backend-production.up.railway.app/uploads/resumes/${this.loggedUser.resume_path}`;
        } else {
          this.resumeUrl = '';
      
        }
        // console.log("Profile Image URL:", this.profileImage);
        // console.log("Resume URL:", this.resumeUrl);
      },
      (error) => {
        console.log('Failed to fetch user data', error);
      }
    );
  }
  onFileSelected(event: any, type: string){
    const file = event.target.files[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl); 

    if (type === 'profile'){
      this.selectedProfileImage = file;
      this.profileImage = sanitizedUrl;
    }else if (type === 'resume'){
      this.selectedResume = file;
      this.resumeFileName = file.name;
      this.newResumeSelected = true;
      this.newResumeUrl = sanitizedUrl; 
    }
  }
  updateProfile(){
    if(this.profileForm.invalid){
      return;
    }
    const formData = new FormData();
    formData.append('name', this.profileForm.value.name);
    formData.append('email_id', this.profileForm.value.email_id);
    formData.append('phone_no', this.profileForm.value.phone_no);
    formData.append('location', this.profileForm.value.location);
  
    if (this.selectedProfileImage) {
      formData.append('jobseekerProfile', this.selectedProfileImage);
    } else if(this.loggedUser.user_profile) {
      formData.append('existingProfile', this.loggedUser.user_profile || 'default.jpg');
    }
    
    if (this.selectedResume) {
      formData.append('resume_path', this.selectedResume);
    } else if (this.loggedUser.resume_path) {
      formData.append('existingResume', this.loggedUser.resume_path);
    }

    const userId = this.loggedUser.user_registerid; 
    console.log('Updating profile for user ID:', userId);

    this.jobsService.updateUserProfile(userId, formData).subscribe((response:any)=>{
      // console.log('API Response:', response); 
      alert("User profile Updated successfully.")
      // console.log('profile updated successfully', response);
      this.loggedUser = response.user;
      this.getUserDetails();
      
      this.profileForm.patchValue({
        name: this.loggedUser.name,
        email_id: this.loggedUser.email_id,
        phone_no: this.loggedUser.phone_no,
        location: this.loggedUser.location
      });
      if (this.loggedUser.user_profile) {
        this.profileImage = `http://localhost:3000/uploads/user_Profiles/${this.loggedUser.user_profile}`;
    }
    if (this.loggedUser.resume_path) {
        this.resumeUrl = `http://localhost:3000/uploads/resumes/${this.loggedUser.resume_path}`;
    }
    this.selectedProfileImage = null;
      this.selectedResume = null;
      
      const profileInput = document.getElementById('profileInput') as HTMLInputElement;
      const resumeInput = document.getElementById('resumeInput') as HTMLInputElement;

      if (profileInput) profileInput.value = '';
      if (resumeInput) resumeInput.value = '';

      const closeModalButton = document.querySelector('#updateModal .btn-close') as HTMLElement;
      if (closeModalButton) closeModalButton.click();

    }, (error) => {
      console.error('Error updating profile', error);
    });
  }
  getFileName(url: string): string {
    if (!url) return '';  
    const fileName = url.split('/').pop() || ''; 
    return fileName.substring(fileName.lastIndexOf('_') + 1); 
  }  
}
