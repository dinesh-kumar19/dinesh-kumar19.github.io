import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JobsService } from '../home/jobs.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router, private jobsService: JobsService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const isAdminLoggedIn = this.jobsService.isAdminLoggedIn();
      
      if (isAdminLoggedIn) {
        return true; 
      } else {
        this.router.navigate(['/admin/CLadmin']);
        return false;
      }
  }
  
}
