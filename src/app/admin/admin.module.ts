import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HomeModule } from '../home/home.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { JobApplicationsComponent } from './job-applications/job-applications.component';
import { CompanyPostjobsComponent } from './company-postjobs/company-postjobs.component';
import { DatePipe } from '@angular/common';
import { RegisteredUserComponent } from './registered-user/registered-user.component';
import { RegisteredCompaniesComponent } from './registered-companies/registered-companies.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminLoginComponent,
    AdminDetailsComponent,
    JobApplicationsComponent,
    CompanyPostjobsComponent,
    RegisteredUserComponent,
    RegisteredCompaniesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DatePipe],
  exports: [
    AdminLoginComponent  
  ]
})
export class AdminModule { }
