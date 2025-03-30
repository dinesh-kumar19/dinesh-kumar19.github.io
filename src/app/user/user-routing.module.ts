import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAuthGuard } from '../guards/user-auth.guard';

const routes: Routes = 
[
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [UserAuthGuard] },
  { path: 'user-profile', component: UserProfileComponent,canActivate: [UserAuthGuard]  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
