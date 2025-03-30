import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/home/jobs.service';

@Component({
  selector: 'app-registered-user',
  templateUrl: './registered-user.component.html',
  styleUrls: ['./registered-user.component.scss']
})
export class RegisteredUserComponent implements OnInit {
  users: any[] = [];
  totalUsers: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;

  constructor(private jobsService: JobsService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers(){
    this.jobsService.getAllUSers(this.limit, this.currentPage).subscribe(
      (response: any)=>{
        this.users = response.data;
        this.totalUsers = response.totalUsers;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
      }
    )
  }
  deleteUserByAdmin(user_registerid:number){
    if(confirm("Are you sure want to delete this user?")){
      this.jobsService.deleteUserByAdmin(user_registerid).subscribe(
        (response: any)=>{
          if(response.success){
            alert("User deleted successfully!");
            this.getAllUsers();
          }else {
            alert("Error: " + response.message);
          }
        },(error) => {
          alert("Error deleting user!");
          console.error(error);
        }
      );
    }
  }
  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.getAllUsers();
    }
  }
}
