import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditUserComponent } from './modal-edit-user.component';

describe('ModalEditUserComponent', () => {
  let component: ModalEditUserComponent;
  let fixture: ComponentFixture<ModalEditUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEditUserComponent]
    });
    fixture = TestBed.createComponent(ModalEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
