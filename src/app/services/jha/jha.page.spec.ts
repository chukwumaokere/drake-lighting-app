import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JhaPage } from './jha.page';

describe('JhaPage', () => {
  let component: JhaPage;
  let fixture: ComponentFixture<JhaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JhaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JhaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
