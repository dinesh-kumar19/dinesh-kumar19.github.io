import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { HomeModule } from '../home/home.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DatePipe } from '@angular/common';
import { UserHeaderComponent } from './user-header/user-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserComponent,
    UserDashboardComponent,
    UserProfileComponent,
    UserHeaderComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    HomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
})
export class UserModule { }
