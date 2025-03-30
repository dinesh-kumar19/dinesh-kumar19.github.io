import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobsService } from 'src/app/home/jobs.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  adminLoginForm! : FormGroup;
  // selectedStatus: string = '';
  showLoginPassword:boolean= false;

  constructor(private router: Router,private http:HttpClient, private JobsService : JobsService) { }

  ngOnInit(): void {
    this.adminLoginForm=new FormGroup({
      adminEmail_id: new FormControl('', [Validators.required, Validators.email]),
      admin_Password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    if(this.JobsService.isAdminLoggedIn()){
      this.router.navigate(['/admin/adminDashboard']);
    }
  }
  showLoginFormPassword(){
    this.showLoginPassword = !this.showLoginPassword;
      }
  logIn(){
    const adminLoginData = this.adminLoginForm.value;
    if (!adminLoginData.adminEmail_id || !adminLoginData.admin_Password) {
      alert('Both email and password are required.');
      return;
    }
    this.loginAsAdmin(adminLoginData);
  }
  loginAsAdmin(adminLoginData: any): void {
    this.http.post('http://localhost:3000/api/jobpostings/loginAdmin',
    {
      admin_email: adminLoginData.adminEmail_id,
      admin_password: adminLoginData.admin_Password,
    },{ withCredentials: true }
  )
  .subscribe(
    (response: any) => {
      if (response.success) {
        alert('Admin Login Successful');
        this.JobsService.setAdminLoggedIn(true);
        //  document.cookie = `admin_authToken=${response.admin.token}; path=/; secure; SameSite=Strict`;
        this.router.navigate(['/admin/admin-details']);
        this.adminLoginForm.reset();
       } else {
        alert('Invalid email or password.');
      }
    },
    (error) => {
      alert('An unexpected error occurred. Please try again.');
    }
  );
  }
}

