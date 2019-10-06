import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyImagesPage } from './property-images.page';

describe('PropertyImagesPage', () => {
  let component: PropertyImagesPage;
  let fixture: ComponentFixture<PropertyImagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyImagesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyImagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
