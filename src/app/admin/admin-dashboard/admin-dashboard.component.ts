import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/home/jobs.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentAdmin : any = {};

  constructor(private http : HttpClient, private jobsService: JobsService, private router: Router) { }

  ngOnInit(): void {
    this.jobsService.getCurrentAdmin().subscribe(
      (response: any) => {
        this.currentAdmin = response.admin;
      },
      (error) => {
        console.log('Failed to fetch admin data', error);
      }
    );
  }

}
