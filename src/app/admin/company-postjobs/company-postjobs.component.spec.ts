import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPostjobsComponent } from './company-postjobs.component';

describe('CompanyPostjobsComponent', () => {
  let component: CompanyPostjobsComponent;
  let fixture: ComponentFixture<CompanyPostjobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyPostjobsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPostjobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
