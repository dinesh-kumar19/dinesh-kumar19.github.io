import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobsService } from '../jobs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // currentUser: any = {};

  constructor(private http : HttpClient, private jobsService: JobsService, private router: Router) { }

  ngOnInit(): void {
    // this.jobsService.getCurrentuser().subscribe(
    //   (response: any) => {
    //     this.currentUser = response.user;
    //     console.log(this.currentUser.id);
    //   },
    //   (error) => {
    //     console.log('Failed to fetch user data', error);
    //   }
    // );
  }
}