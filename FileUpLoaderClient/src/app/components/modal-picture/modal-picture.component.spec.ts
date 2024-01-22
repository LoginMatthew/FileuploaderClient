import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPictureComponent } from './modal-picture.component';

describe('ModalPictureComponent', () => {
  let component: ModalPictureComponent;
  let fixture: ComponentFixture<ModalPictureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPictureComponent]
    });
    fixture = TestBed.createComponent(ModalPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
