import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JhaHospitalPage } from './jha-hospital.page';

describe('JhaHospitalPage', () => {
  let component: JhaHospitalPage;
  let fixture: ComponentFixture<JhaHospitalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JhaHospitalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JhaHospitalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
