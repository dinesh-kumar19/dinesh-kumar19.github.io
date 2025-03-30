import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject,Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  category:any;
  // private storageKey = 'jobApplications';
  private loggedIn: boolean = false;
  private adminLoggedIn: boolean = false;
  private companyLoggedIn: boolean = false;
  // Create a BehaviorSubject to hold the search query
  private searchProcessData  = new BehaviorSubject<string>('');
 // Observable for components to subscribe to
  searchQuery$ = this.searchProcessData.asObservable();

  constructor(private http:HttpClient, private router: Router) {
   }
  getJobcategory(limit: number, offset: number): Observable<any> {
    return this.http.get(`http://localhost:3000/api/jobpostings/getcategory?limit=${limit}&offset=${offset}`);
  }
  getSubcategory(limit: number, offset: number): Observable<any>{
    return this.http.get(`http://localhost:3000/api/jobpostings/getSubcategory?limit=${limit}&offset=${offset}`);
  }
  getSubcategoryByCategory(categoryId: number, limit: number, offset: number): Observable<any>{
    return this.http.get(`http://localhost:3000/api/jobpostings/getSubcategoryByCategory/${categoryId}?limit=${limit}&offset=${offset}`);
  }
  // update jobposting status by Admin
  updateJobStatusByAdmin(jobposting_id: number, jobposting_status: string): Observable<any> {
    return this.http.put(`http://localhost:3000/api/jobpostings/update-statusByAdmin`,{ jobposting_id, jobposting_status });
}

  filterSubcategories(categoryId: number, subcategoryFilterData: any): Observable<any>{
    return this.http.post(`http://localhost:3000/api/jobpostings/filterSubcategories`,{ categoryId, ...subcategoryFilterData });
  }
  getJobpostingBySubcategories(postingId: number, limit: number, offset: number): Observable<any>{
    return this.http.get(`http://localhost:3000/api/jobpostings/getJobPostingBySubcategories/${postingId}?limit=${limit}&offset=${offset}`)
  }
  // login details
  getCurrentuser() : Observable<any>{
    return this.http.get('http://localhost:3000/api/jobpostings/getCurrentUser', { withCredentials: true });
  }
  // update user-profile
  updateUserProfile(userId:number, formData: FormData): Observable<any>{
    return this.http.put(`http://localhost:3000/api/jobpostings/update-userProfile/${userId}`, formData);
  }
  isLoggedIn(): boolean {
    // return this.loggedIn || document.cookie.includes('auth_token'); 
    const userLoggedInStatus = localStorage.getItem('userLoggedIn') === 'true';
    const isUserLogggedInFromCookie = document.cookie.includes('auth_token');
    return userLoggedInStatus || isUserLogggedInFromCookie;
  }
  // Set the login status
  setLoggedIn(status: boolean): void {
    this.loggedIn = status;
    localStorage.setItem('userLoggedIn', status.toString());
  }
  // Handle logout by calling backend API to remove session and clearing the cookies
  logoutUser(): Observable<any> {
    return this.http.get('http://localhost:3000/api/jobpostings/logoutUser', { withCredentials: true });
  }
  clearUserLoginState(): void {
    localStorage.removeItem('userLoggedIn');
  }
  // company login
  isCompanyLoggedIn(): boolean {
    // return this.companyLoggedIn || document.cookie.includes('provider_authToken');
    const companyLoggedInStatus = localStorage.getItem('companyLoggedIn') === 'true';
    const isCompanyLoggedInFromCookie = document.cookie.includes('provider_authToken');
    return companyLoggedInStatus || isCompanyLoggedInFromCookie;
  }
  setCompanyLoggedIn(status: boolean): void {
    this.companyLoggedIn = status;
    localStorage.setItem('companyLoggedIn', status.toString());
  }
  getCurrentCompany() : Observable<any>{
    return this.http.get('http://localhost:3000/api/jobpostings/getCurrentCompany', { withCredentials: true });
  }
  logoutCompany():Observable<any>{
    return this.http.get('http://localhost:3000/api/jobpostings/logoutCompany', {withCredentials: true});
  }
  clearCompanyLoginState(): void {
    localStorage.removeItem('companyLoggedIn');
  }
  // admin side process
  // admin login 
  getCurrentAdmin(): Observable<any>{
    return this.http.get('http://localhost:3000/api/jobpostings/getCurrentAdmin', {withCredentials: true});
  }
  isAdminLoggedIn(): boolean{
    // return this.adminLoggedIn || document.cookie.includes('admin_authToken');
    const loggedInStatus = localStorage.getItem('adminLoggedIn') === 'true';
    const isLoggedInFromCookie = document.cookie.includes('admin_authToken');
    return loggedInStatus || isLoggedInFromCookie;
  }
  setAdminLoggedIn(status: boolean): void{
    this.adminLoggedIn = status;
    localStorage.setItem('adminLoggedIn', status.toString());
  }
  logoutAdmin():Observable<any>{
    return this.http.get('http://localhost:3000/api/jobpostings/logoutAdmin', {withCredentials: true});
  }
  clearAdminLoginState(): void {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('admin_authToken');
  }
  // get all users and all companies
  getAllUSers(limit: number, page: number): Observable<any>{
    return this.http.get(`http://localhost:3000/api/jobpostings/registered-users?limit=${limit}&page=${page}`);
  }
  deleteJobPostingByAdmin(jobposting_id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/jobpostings/delete-jobposting/${jobposting_id}`);
}
  deleteUserByAdmin(user_registerid: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/jobpostings/deleteUserByAdmin/${user_registerid}`);
  }
  getAllCompanies(limit: number, page: number): Observable<any>{
    return this.http.get(`http://localhost:3000/api/jobpostings/registered-comapnies?limit=${limit}&page=${page}`);
  }
  deleteCompaniesByAdmin(company_id: number): Observable<any>{
    return this.http.delete(`http://localhost:3000/api/jobpostings/deleteCompaniesByAdmin/${company_id}`);
  }
  getJobPosting(limit: number, page: number): Observable<any>{
    return this.http.get(`http://localhost:3000/api/jobpostings/getJobposting?limit=${limit}&page=${page}`);
  }
  // post a job 
  postJobData(jobData: FormData): Observable<any> {
    return this.http.post('http://localhost:3000/api/jobpostings/post-job', jobData);
  }
  // get posted jobs by company
  getActiveJobsByCompany(company_id: number, limit: number, page: number ): Observable<any>{
    return this.http.get(`http://localhost:3000/api/jobpostings/active-jobs/${company_id}?limit=${limit}&page=${page}`)
  }
  deleteJobPostingByCompany(jobposting_id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/jobpostings/delete-jobposting/${jobposting_id}`);
  }
  deleteJobApplicationByCompany(job_applicationID: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/jobpostings/delete-application/${job_applicationID}`);
  }
  
  // apply for job
  applyForJob(user_id:number, job_id: number): Observable<any> {
    const applicationDetails = {user_id, job_id};
    return this.http.post('http://localhost:3000/api/jobpostings/apply-job',applicationDetails);
  }
  checkApplicationStatus(user_id: number): Observable<any>{
    return this.http.get(`http://localhost:3000/api/jobpostings/status/${user_id}`);
  }
  // get applied jobs to show in admin
  getAppliedJobs(limit: number, page: number): Observable<any>{
    return this.http.get(`http://localhost:3000/api/jobpostings/getApplications?limit=${limit}&page=${page}`);
  }
  getApplicationsByCompany(company_id: number, limit: number, page: number): Observable<any>{
    return this.http.post(`http://localhost:3000/api/jobpostings/getApplicationsByCompany`,{company_id, limit: limit,
      page: page});
  }
  getApplicationsByUser(user_id: number, limit: number, page: number): Observable<any>{
    return this.http.post(`http://localhost:3000/api/jobpostings/getApplicationsByUser`,{user_id, limit: limit, page: page});
  }
  deleteUserApplication(job_applicationID: number, user_id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/jobpostings/deleteUserApplication?job_applicationID=${job_applicationID}&user_id=${user_id}`);
}
  // update job application status
  updateJobApplicationStatus(job_applicationID: number, job_status: string): Observable<any>{
    return this.http.put(`http://localhost:3000/api/jobpostings/update-status`, {job_applicationID,job_status});
  }
  // search jobs
  // Method to update the search query
  updateSearchQuery(query: string){
    this.searchProcessData.next(query);
  }
  searchJobs(searchParams: any): Observable<any>{
    return this.http.post('http://localhost:3000/api/jobpostings/searchJobs', searchParams);
  }
  getSearchSuggestions(searchTerm: string): Observable<any>{
    return this.http.get(`http://localhost:3000/api/jobpostings/searchSuggestions?q=${searchTerm}`);
  }
  // Filter jobs
  filterJobs(filters: any): Observable<any>{
    return this.http.post('http://localhost:3000/api/jobpostings/filterJobs',filters);
  }
  //update forgot password for user 
  sendUserOtp(email_id: string): Observable<any>{
    return this.http.post(`http://localhost:3000/api/jobpostings/forgot-userPassword`,{ email_id });
  }
  verifyUserOtp(email_id: string, userOtp: string): Observable<any>{
    return this.http.post(`http://localhost:3000/api/jobpostings/verify-userOtp`,{ email_id, userOtp});
  }
  resetUserPassword(email_id: string, userNewPassword: string): Observable<any>{
    return this.http.post(`http://localhost:3000/api/jobpostings/reset-userPassword`,{ email_id, userNewPassword});
  } 
  //update forgot password for company
  sendCompanyOtp(data: any): Observable<any>{
    return this.http.post(`http://localhost:3000/api/jobpostings/forgot-companyPassword`,data);
  }
  verifyCompanyOtp(data: any): Observable<any>{
    return this.http.post(`http://localhost:3000/api/jobpostings/verify-companyOtp`,data);
  }
  resetCompanyPassword(data:any): Observable<any>{
    return this.http.post(`http://localhost:3000/api/jobpostings/reset-companyPassword`,data);
  } 
}