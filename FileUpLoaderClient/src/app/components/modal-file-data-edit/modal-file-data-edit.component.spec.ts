import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFileDataEditComponent } from './modal-file-data-edit.component';

describe('ModalFileDataEditComponent', () => {
  let component: ModalFileDataEditComponent;
  let fixture: ComponentFixture<ModalFileDataEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFileDataEditComponent]
    });
    fixture = TestBed.createComponent(ModalFileDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
