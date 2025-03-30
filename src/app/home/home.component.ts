import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { JobsService } from './jobs.service';
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  totalCategories: number = 0;
  limit: number = 8;
  offset: number = 0; 
  currentPage: number = 1;
  loading: boolean = false;
  experienceOptions: string[] = [];
  jobSearchForm! : FormGroup;
  suggestions: string[] = [];
  showSuggestions: boolean = false;
  searchData: string = '';

constructor(private jobsService: JobsService, private router: Router, private formbuilder: FormBuilder) {}

ngOnInit(): void {
  this.initializeAOS();
  AOS.init();
  this.loadCategories();

  for (let i = 1; i <= 10; i++) {
    this.experienceOptions.push(i === 1 ? `${i} year` : `${i} years`);
  }

  // Use FormBuilder to create the form group properly
  this.jobSearchForm = this.formbuilder.group({
    jobtitle: [''],
    experience: [''],
    job_location: [''],
  });

  this.jobSearchForm.get('jobtitle')?.valueChanges.subscribe((value) => {
    if (value && value.trim()) {
      this.jobsService.getSearchSuggestions(value.trim()).subscribe(
        (response) => {
          if (response.success) {
            this.suggestions = response.suggestions;
          }
        },
        (error) => {
          console.error('Error fetching suggestions:', error);
        }
      );
    } else {
      this.suggestions = [];
    }
  });
 }

 initializeAOS() {
  setTimeout(() => {
    AOS.refreshHard(); 
  }, 200);
  }
  loadCategories(){
    if (this.loading) return;
    this.loading = true;
    this.jobsService.getJobcategory(this.limit, this.offset).subscribe((res:any)=>{
      // console.log('Backend response:', res); 
      if (res.success)  {
        this.categories = res.data;
        this.totalCategories = res.totalCategories;
      }
      this.loading = false;
    });
  }
  getTotalPages(): number {
    return Math.ceil(this.totalCategories / this.limit);
  }
  nextPage() {
    if (this.offset + this.limit < this.totalCategories) {
      this.offset += this.limit;
      this.currentPage++;
      this.loadCategories();
    }
  }

  previousPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.currentPage--;
      this.loadCategories();
    }
  }
  viewSubcategories(categoryId: number): void {
    this.router.navigate(['/home/filtersubcategory', categoryId]);
  }
  navigateToJobList(){
    this.router.navigate(['/home/job-list']);
  }
  findJob(){
    this.router.navigate(['/home/job-list']);
  }
  searchJobs(){
    const formData = this.jobSearchForm.value;
   
    if (!formData.jobtitle && !formData.experience && !formData.job_location) {
      alert('Please enter at least one search field');
      return;
    }
    const query: any = {};
    if (formData.jobtitle) {
      query.jobtitle = formData.jobtitle;
    }
    if (formData.experience) {
      if (formData.experience.toLowerCase() === 'fresher') {
        query.experience = 'fresher';
      } else {
        query.experience = formData.experience.split(' ')[0]; 
      }
    }
    if (formData.job_location) {
      query.job_location = formData.job_location;
    }
    this.jobsService.updateSearchQuery(query);
    this.router.navigate(['/home/search-result']);
  }
  selectSuggestion(suggestion: string): void {
    this.jobSearchForm.patchValue({ jobtitle: suggestion });
    this.suggestions = [];
  }
  onJobTitleFocus() {
    this.showSuggestions = true;
  }
  onJobTitleBlur() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}
