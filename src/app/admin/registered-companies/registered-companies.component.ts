import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/home/jobs.service';

@Component({
  selector: 'app-registered-companies',
  templateUrl: './registered-companies.component.html',
  styleUrls: ['./registered-companies.component.scss']
})
export class RegisteredCompaniesComponent implements OnInit {
  companies: any[] = [];
  totalCompanies: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  limit: number = 10;
  constructor(private jobsService: JobsService) { }

  ngOnInit(): void {
    this.getAllCompanies();
  }
  getAllCompanies(){
    this.jobsService.getAllCompanies(this.limit, this.currentPage).subscribe(
      (response: any)=>{
        this.companies = response.data;
        this.totalCompanies = response.totalCompanies;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
      }
    )
  }
  deleteCompaniesByAdmin(company_id:number){
    if(confirm("Are you sure want to delete this company?")){
      this.jobsService.deleteCompaniesByAdmin(company_id).subscribe(
        (response: any)=>{
          if(response.success){
            alert("company deleted successfully!");
            this.getAllCompanies();
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
      this.getAllCompanies();
    }
  }
}
