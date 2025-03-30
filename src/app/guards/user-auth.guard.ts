import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JobsService } from '../home/jobs.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(private router: Router, private jobsService: JobsService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const isUserLoggedIn = this.jobsService.isLoggedIn();
      if (isUserLoggedIn) {
        return true;
      }else {
        this.router.navigate(['/home/login']);
        return false;
      }
  }
  
}
