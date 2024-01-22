import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDataCreaterComponent } from './file-data-creater.component';

describe('FileDataCreaterComponent', () => {
  let component: FileDataCreaterComponent;
  let fixture: ComponentFixture<FileDataCreaterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileDataCreaterComponent]
    });
    fixture = TestBed.createComponent(FileDataCreaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
