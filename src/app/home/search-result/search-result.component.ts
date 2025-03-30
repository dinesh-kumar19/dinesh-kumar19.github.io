import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../jobs.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  jobResults: any[]=[];
  searchParams: any;
  searchMode: boolean = false;

  limit: number = 10;
  offset: number = 0;
  loading: boolean = false;
  // currentPage: number = 1;
  // totalPages: number = 1;  
  searchQuery: string ='';

  paginatedResults: any[] = [];
  currentPage: number = 1;
  pageSize: number = 12;  
  totalPages: number = 1;

  constructor(private route: ActivatedRoute, private jobsService: JobsService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getSearchResults();
  }
  getSearchResults(){
    this.jobsService.searchQuery$.subscribe((params:any) =>{
      this.searchParams = params;
      if (this.searchParams) {
        this.searchMode = true; 
        this.fetchJobResults();
      }
    });
  }
  fetchJobResults(){
    this.jobsService.searchJobs(this.searchParams).subscribe(
      (response: any)=>{
        if(response.success){
          this.jobResults = response.data;
          this.saveSearchState();
        }
        else {
          this.jobResults = [];
          alert('No matching jobs found!');
        }
      },
      (error) => {
        console.error('Error fetching job results:', error);
      }
    );
  }
  saveSearchState(): void {
    const searchState = {
      searchMode: this.searchMode,
      searchParams: this.searchParams,
      jobResults: this.jobResults,
    };
    console.log('Saving state to sessionStorage:', searchState); 
    sessionStorage.setItem('searchState', JSON.stringify(searchState));
  }
  resetSearch(): void {
    this.searchMode = false;
    this.jobResults = [];
    this.searchParams = null;
    sessionStorage.removeItem('searchState');
    // this.getSubcategories();
  }
  viewJobposting(postingId: number): void {
    this.router.navigate(['/home/jobposting', postingId]);
  }
  // loadNextPage() {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++;
  //     this.offset = (this.currentPage - 1) * this.limit;
  //     // console.log("Next button clicked, moving to page", this.currentPage);
  //     // this.getSubcategories();
  //   } else {
  //     // console.log("Next button disabled: No more pages.");
  //   }
  // }
  // loadPreviousPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.offset = (this.currentPage - 1) * this.limit;
  //     // console.log("Previous button clicked, moving to page", this.currentPage);
  //     // this.getSubcategories();
  //   } else {
  //     // console.log("Previous button disabled: Already on the first page.");
  //   }
  // }
  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedResults = this.jobResults.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

}
