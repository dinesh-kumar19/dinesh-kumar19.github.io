import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
import { CompanyHeaderComponent } from './company-header/company-header.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { PostJobComponent } from './post-job/post-job.component';
import { AllApplicationsComponent } from './all-applications/all-applications.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostedJobsComponent } from './posted-jobs/posted-jobs.component';

@NgModule({
  declarations: [
    CompanyComponent,
    CompanyDashboardComponent,
    CompanyHeaderComponent,
    CompanyProfileComponent,
    PostJobComponent,
    AllApplicationsComponent,
    CompanyDetailsComponent,
    PostedJobsComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule, 
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CompanyModule { }
