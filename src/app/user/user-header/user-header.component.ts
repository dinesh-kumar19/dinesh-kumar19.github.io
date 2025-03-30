import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobsService } from 'src/app/home/jobs.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
export class UserHeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isCompanyLoggedIn : boolean = false;
  showMenu : boolean = false;
  isLargeScreen: boolean = true;
  showSidebar: boolean = false;
  showProfileMenu: boolean = false;
  loginUser: any = {};

  constructor(private router: Router, private jobsService: JobsService) {
    this.checkScreenSize();
   }

    ngOnInit(): void {
      this.isLoggedIn = this.jobsService.isLoggedIn();
      this.isCompanyLoggedIn = this.jobsService.isCompanyLoggedIn();
      this.getCurrentUser();
    }
    logout(): void{
      if (this.isLoggedIn){
        this.jobsService.logoutUser().subscribe(
              (response) => {
                this.jobsService.setLoggedIn(false);
                this.jobsService.clearUserLoginState();
                this.isLoggedIn = false;
                this.router.navigate(['/home/login']);
              },
              (error) => {
                console.error('Logout failed', error);
              }   
      );
    }
      else if (this.isCompanyLoggedIn){
        this.jobsService.logoutCompany().subscribe(
        (response) =>{
          this.jobsService.setCompanyLoggedIn(false);
          this.jobsService.clearCompanyLoginState();
          this.isCompanyLoggedIn = false;
          this.router.navigate(['home/login']);
        },
        (error) => {
                console.error('Logout failed', error);
              }
        );
      }
    }
    toggleProfile(){
      this.showProfileMenu = !this.showProfileMenu;
    }
    // @HostListener('document:click', ['$event'])
    // onClickOutside(event: MouseEvent) {
    //   const target = event.target as HTMLElement;
    //   if (!target.closest('.user-pic') && !target.closest('.sub-menu')) {
    //     this.showMenu = false;
    //   }
    // }
    @HostListener('window:resize', ['$event'])
    checkScreenSize() {
      this.isLargeScreen = window.innerWidth > 768;
      if (this.isLargeScreen) {
        this.showSidebar = false;
      }
    }
    toggleSidebar(){
      this.showSidebar = !this.showSidebar;
    }
    getCurrentUser(): void{
      this.jobsService.getCurrentuser().subscribe(
        (response:any)=>{
          this.loginUser = response.user;
        },
        (error) => {
          console.log('Failed to fetch user data', error);
        },
      );
    }
    }
  
