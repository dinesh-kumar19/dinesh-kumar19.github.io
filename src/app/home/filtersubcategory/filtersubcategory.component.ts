import { Component, OnInit } from '@angular/core';
import { JobsService } from '../jobs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filtersubcategory',
  templateUrl: './filtersubcategory.component.html',
  styleUrls: ['./filtersubcategory.component.scss']
})
export class FiltersubcategoryComponent implements OnInit {
  subcategories: any[] = [];
  filteredSubcategories: any[] = [];
  categoryId!: number;
  subcategoryJobFilter!: FormGroup;
  isSubcategoryFiltered: boolean = false;

  constructor(
    private jobsService: JobsService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('categoryId')!;

    // Initialize filter form
    this.subcategoryJobFilter = new FormGroup({
      jobtitle: new FormControl(''),
      job_location: new FormControl('')
    });

    // Check localStorage for filter data and pre-fill the form
    const storedFilter = localStorage.getItem('filterData');
    const storedFilteredData = localStorage.getItem('filteredSubcategories');

    if (storedFilter) {
      const filterData = JSON.parse(storedFilter);
      this.subcategoryJobFilter.patchValue(filterData);  // Pre-fill form
    }

    if (storedFilteredData) {
      this.filteredSubcategories = JSON.parse(storedFilteredData);
      this.isSubcategoryFiltered = true;
    } else {
      this.fetchSubcategories();
    }
  }

  // Fetch subcategories
  fetchSubcategories(): void {
    this.jobsService.getSubcategoryByCategory(this.categoryId, 10, 0).subscribe(response => {
      if (response.success) {
        this.subcategories = response.data.map((subcategory: any) => ({
          ...subcategory,
          date: this.datePipe.transform(subcategory.date, 'yyyy-MM-dd')
        }));
        console.log('Fetched subcategories:', this.subcategories);

        // Display original subcategories if no filters applied
        if (!this.isSubcategoryFiltered) {
          this.filteredSubcategories = [...this.subcategories];
        }
      }
    });
  }

  // Navigate to job postings
  viewJobpostings(postingId: number): void {
    this.router.navigate(['/home/jobposting', postingId]);
  }

  // Apply filters
  applyFilters(): void {
    const filterData = this.subcategoryJobFilter.value;

    // Check if filters are empty
    if (!filterData.jobtitle && !filterData.job_location) {
      alert('Please enter at least one filter field.');
      return;
    }

    console.log('Filter data being sent:', JSON.stringify(filterData));

    this.jobsService.filterSubcategories(this.categoryId, filterData).subscribe(response => {
      if (response.success) {
        this.filteredSubcategories = response.data;

        // Store filtered data and form inputs in localStorage
        localStorage.setItem('filteredSubcategories', JSON.stringify(this.filteredSubcategories));
        localStorage.setItem('filterData', JSON.stringify(filterData));  // Store form data
        this.isSubcategoryFiltered = true;

        console.log('Filtered Subcategories:', this.filteredSubcategories);
      } else {
        console.error('Filter failed:', response.message);
      }
    });
  }

  // Clear filters
  clearFilters(): void {
    this.subcategoryJobFilter.reset();  // Clear the form
    localStorage.removeItem('filteredSubcategories');   // Remove filtered data
    localStorage.removeItem('filterData');              // Remove form input data
    this.isSubcategoryFiltered = false;
    this.fetchSubcategories();
  }
}
