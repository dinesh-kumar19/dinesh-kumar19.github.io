import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { JobListComponent } from './joblist/joblist.component';
import { JobsService } from './jobs.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FiltersubcategoryComponent } from './filtersubcategory/filtersubcategory.component';
import { JobpostingComponent } from './jobposting/jobposting.component';
import { DatePipe } from '@angular/common';
import { SearchResultComponent } from './search-result/search-result.component';



@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    JobListComponent,
    DashboardComponent,
    FiltersubcategoryComponent,
    JobpostingComponent,
    SearchResultComponent,

  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    JobsService,
    DatePipe
   ]
})
export class HomeModule { }
