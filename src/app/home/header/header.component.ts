import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobsService } from '../jobs.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isCompanyLoggedIn : boolean = false;
  showMenu : boolean = false;
  isLargeScreen: boolean = true;
  showSidebar: boolean = false;
  showProfileMenu: boolean = false;
  loginUser: any = {};
  profileImage: string = 'assets/profile/profile_pic.png';

  constructor(private router: Router, private jobsService: JobsService) {
    this.checkScreenSize();
   }

  ngOnInit(): void {
    this.isLoggedIn = this.jobsService.isLoggedIn();
    this.isCompanyLoggedIn = this.jobsService.isCompanyLoggedIn();
    this.getCurrentUser();
  }
  profileView(){
    if(this.isLoggedIn){
      this.router.navigate(['/user/user-profile']);
    } else {
      this.router.navigate(['/home/login']);
    }
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
  toggleProfile(event: Event){
    event.stopPropagation();
    this.showProfileMenu = !this.showProfileMenu;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')){
      this.showProfileMenu = false;
    }
  }
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
        this.setProfileImage();
      },
      (error) => {
        console.log('Failed to fetch user data', error);
      },
    );
  }
  setProfileImage() {
    if (this.loginUser.user_profile && this.loginUser.user_profile.trim() !== '' && 
    this.loginUser.user_profile !== 'default.jpg') {
      this.profileImage = `https://careerlink-jobportal-backend-production.up.railway.app/uploads/user_Profiles/${this.loginUser.user_profile}`;
    } else {
      this.profileImage = 'assets/profile/profile_pic.png'; 
    }
  }
  }

