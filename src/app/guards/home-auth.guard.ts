import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JobsService } from '../home/jobs.service';

@Injectable({
  providedIn: 'root'
})
export class HomeAuthGuard implements CanActivate {
  constructor(private router: Router, private jobsService: JobsService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const isLoggedIn = this.jobsService.isLoggedIn();
      if (isLoggedIn) {
        return true;
      }else {
        this.router.navigate(['/home/login']);
        return false;
      }
  }
  
}
