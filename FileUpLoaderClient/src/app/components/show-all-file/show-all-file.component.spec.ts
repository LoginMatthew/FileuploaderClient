import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllFileComponent } from './show-all-file.component';

describe('ShowAllFileComponent', () => {
  let component: ShowAllFileComponent;
  let fixture: ComponentFixture<ShowAllFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowAllFileComponent]
    });
    fixture = TestBed.createComponent(ShowAllFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
