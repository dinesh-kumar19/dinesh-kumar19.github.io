import { Component, OnInit,  AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../jobs.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-job-list',
  templateUrl: './joblist.component.html', 
  styleUrls: ['./joblist.component.scss']
})
export class JobListComponent implements OnInit, AfterViewInit {
  subcategories: any[] = [];
  filteredJobs: any[] = [];
  jobcategory_id: number | null = null;

  jobFilterForm!: FormGroup;
  showFilteredJobs: boolean = false; 
  showNoResultMessage: boolean = false;
  showClearButton: boolean = false;

  limit: number = 10;
  offset: number = 0;
  loading: boolean = false;
  totalCount: number = 0;
  totalFilteredCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1; 
  totalFilteredPages: number = 1; 
  
  jobTypes = [
    {name: 'Full-time', value: 'Full Time'},
    {name: 'Part-time', value: 'Part Time'},
    {name: 'Remote', value: 'Remote'},
    {name: 'Freelance', value: 'Freelance'},
    {name: 'Contract', value: 'Contract'}
  ];
  jobExperiences = [
    { name: 'Fresher', value: 'fresher' },
    { name: '0-1 years', value: '0'},        
    { name: '1-3 Years', value: '1' },       
    { name: '2-4 Years', value: '2' },
    { name: '3-5 Years', value: '3' },
    { name: '4-6 Years', value: '4' },  
    { name: '6-more..', value: '6' }      
  ];
  
  constructor(private route: ActivatedRoute, private jobsService: JobsService, private router: Router, private datePipe: DatePipe, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.filterForm();
    const filters = localStorage.getItem('jobFilters');
    if (filters) {
      this.loadFiltersFromLocalStorage();
    } else {
      this.getSubcategories();
    }
    this.route.params.subscribe(params => {
      this.jobcategory_id = +params['id'];
      this.getSubcategories();
      
    });
    if (this.isFilterApplied()) {
      this.getFilteredJobs();
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const filters = localStorage.getItem('jobFilters');
      if (filters) {
        this.getFilteredJobs();
      }
      this.cdRef.detectChanges();
    });
  }
  filterForm(){
    this.jobFilterForm = new FormGroup(
      {
        jobtitle: new FormControl(''),
        job_location: new FormControl(''),
        employeetype: new FormArray([]),
        experience: new FormArray([]),
      });
  }
  getSubcategories() {
    this.loading = true;
    this.jobsService.getSubcategory(this.limit, this.offset).subscribe((res: any) => {
      if (res.success) {
        this.subcategories = res.data;
        // console.log(this.subcategories)
        this.subcategories.forEach(subcategoriesDate=>{
          subcategoriesDate.date = this.datePipe.transform(subcategoriesDate.date, 'yyyy-MM-dd');
        });
        // Set pagination
        this.totalPages = Math.ceil(res.totalCount / this.limit);
        this.showFilteredJobs = false;
        this.showNoResultMessage = false;
      } else {
        console.error('Failed to fetch subcategories');
      }
      this.loading = false;
    },
    error => {
      console.error('Error:', error);
      this.loading = false;
    }
  );
  }
 getFilteredJobs() {
  this.loading = true;
  const filters = this.getFilterData();

  this.jobsService.filterJobs(filters).subscribe(
    (res: any) => {
      if (res.success && res.data.length > 0) {
        this.filteredJobs = res.data;
        this.totalFilteredCount = res.totalCount; 
        this.totalFilteredPages = Math.ceil(res.totalCount / this.limit); 
        this.showFilteredJobs = true;
        this.showNoResultMessage = false; 
        this.showClearButton = true;   
        if (this.currentPage > this.totalFilteredPages) {
          this.currentPage = this.totalFilteredPages;
        }    
      } else {
        this.filteredJobs = [];
        this.showFilteredJobs = false;
        this.showNoResultMessage = true;  
        this.showClearButton = true;       
      }
      this.loading = false;
      this.cdRef.detectChanges();
    },
    (error) => {
      this.loading = false;

      if (error.status === 404) {
        // console.log('No results found');
        this.filteredJobs = [];
        this.showFilteredJobs = false; 
        this.showNoResultMessage = true; 
        this.showClearButton = true; 
      } else {
        console.error('Error:', error);
        this.showNoResultMessage = true;  
        this.showClearButton = true;
      }
    }
  );
}
applyFilters(): void {
    if (!this.isFilterApplied()) {
      this.clearFilters();
      return;
    }
    const filters = this.getFilterData();
    localStorage.setItem('jobFilters', JSON.stringify(filters));
    this.getFilteredJobs();

    if (!this.isFilterApplied()) {
      this.showFilteredJobs = false;
      this.getSubcategories();
      return;
    }
    this.loading = true;
    this.jobsService.filterJobs(filters).subscribe(
      (res: any) => {
        if (res.success) {
          this.filteredJobs = res.data;
          this.showFilteredJobs = true;  
          this.showClearButton = true;
        } else {
          console.error('Failed to fetch filtered jobs');
          this.showFilteredJobs = false;
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.status === 404) {
          this.filteredJobs = [];
          this.showFilteredJobs = false;
          console.log('No filter results found');
        } else {
          console.error('Error filtering jobs:', error);
        }
      }
    );
  }
  
  loadFiltersFromLocalStorage(): void {
    const filters = localStorage.getItem('jobFilters');
    if (filters) {
      const parsedFilters = JSON.parse(filters);
      this.jobFilterForm.patchValue({
        jobtitle: parsedFilters.jobtitle || '',
        job_location: parsedFilters.job_location || ''
      });

      const employeetypeArray = this.jobFilterForm.get('employeetype') as FormArray;
      const experienceArray = this.jobFilterForm.get('experience') as FormArray;

      // Clear existing form arrays
      employeetypeArray.clear();
      experienceArray.clear();

      // Restore selected filters
      if (parsedFilters.employeetype) {
        parsedFilters.employeetype.forEach((value: string) => {
          employeetypeArray.push(new FormControl(value));
        });
      }
      if (parsedFilters.experience) {
        parsedFilters.experience.forEach((value: string) => {
          experienceArray.push(new FormControl(value));
        });
      }

      this.getFilteredJobs();  
    }
  }

  restoreFilters(): void {
    const savedFilters = localStorage.getItem('jobFilters');
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      this.jobFilterForm.patchValue({
        jobtitle: filters.jobtitle || '',
        job_location: filters.job_location || ''
      });

      this.restoreFormArray('employeetype', filters.employeetype || []);
      this.restoreFormArray('experience', filters.experience || []);

      this.limit = filters.limit || this.limit;
      this.offset = filters.offset || this.offset;
    }
  }
  restoreFormArray(arrayName: string, values: any[]) {
    const formArray = this.jobFilterForm.get(arrayName) as FormArray;
    formArray.clear();
    values.forEach(value => formArray.push(new FormControl(value)));
  }
  getFilterData() {
    const filters: any = {};
    const jobTitle = this.jobFilterForm.get('jobtitle')?.value;
    if (jobTitle) filters.jobtitle = jobTitle;
    const jobLocation = this.jobFilterForm.get('job_location')?.value;
    if (jobLocation) filters.job_location = jobLocation;
    const employeetypeArray = this.jobFilterForm.get('employeetype')?.value;
    if (employeetypeArray && employeetypeArray.length > 0) {
      filters.employeetype = employeetypeArray;
    }
    const experienceArray = this.jobFilterForm.get('experience')?.value;
    if (experienceArray && experienceArray.length > 0) {
      filters.experience = experienceArray;
    }
    filters.limit = this.limit;
    filters.offset = (this.currentPage - 1) * this.limit;;

    return filters;
  }
  isFilterApplied(): boolean {
    const { jobtitle, job_location, employeetype, experience } = this.jobFilterForm.value;
    return (
      (jobtitle?.trim() || '') !== '' || 
    (job_location?.trim() || '') !== '' || 
    (employeetype?.length > 0) || 
    (experience?.length > 0)
    );
  }
  onCheckBoxChangeJobType(event: any) {
    const jobtypeArray: FormArray = this.jobFilterForm.get('employeetype') as FormArray;

    if (event.target.checked) {
      jobtypeArray.push(new FormControl(event.target.value));
    } else {
      const index = jobtypeArray.controls.findIndex(control => control.value === event.target.value);
      if (index !== -1) {
        jobtypeArray.removeAt(index);
      }
    }
    this.applyFilters();
  }
  onCheckBoxChangeExperience(event: any) {
    const jobexperienceArray: FormArray = this.jobFilterForm.get('experience') as FormArray;
    const value = event.target.value.trim().toLowerCase(); 
  
    if (event.target.checked) {
      if (!jobexperienceArray.value.includes(value)) {
        jobexperienceArray.push(new FormControl(value));
      }
    } else {
      const index = jobexperienceArray.controls.findIndex(
        control => control.value.trim().toLowerCase() === value
      );
      if (index !== -1) {
        jobexperienceArray.removeAt(index);
      }
    }
    this.applyFilters();
  }
  clearFilters() {
    this.jobFilterForm.reset();
    (this.jobFilterForm.get('employeetype') as FormArray).clear();
    (this.jobFilterForm.get('experience') as FormArray).clear();
    this.filteredJobs = [];
    this.showFilteredJobs = false;
    this.showNoResultMessage = false;
    this.showClearButton = false;
    localStorage.removeItem('jobFilters');
    this.getSubcategories();
  }
  viewJobposting(postingId: number): void {
    this.router.navigate(['/home/jobposting', postingId]);
  }
  loadNextPage(pageType: string) {
    if (pageType === 'subcategory' && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.offset = (this.currentPage - 1) * this.limit;
      this.getSubcategories();
    } else if (pageType === 'filtered' && this.currentPage < this.totalFilteredPages) {
      this.currentPage++;
      console.log("Next Page:", this.currentPage);
      this.offset = (this.currentPage - 1) * this.limit;
      this.getFilteredJobs();
    }
  }
  
  loadPreviousPage(pageType: string) {
    if (pageType === 'subcategory' && this.currentPage > 1) {
      this.currentPage--;
      this.offset = (this.currentPage - 1) * this.limit;
      this.getSubcategories();
    } else if (pageType === 'filtered' && this.currentPage > 1) {
      this.currentPage--;
      console.log("Previous Page:", this.currentPage);
      this.offset = (this.currentPage - 1) * this.limit;
      this.getFilteredJobs();
    }
  }
}