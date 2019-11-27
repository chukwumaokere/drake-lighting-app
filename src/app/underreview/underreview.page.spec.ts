import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderreviewPage } from './underreview.page';

describe('UnderreviewPage', () => {
  let component: UnderreviewPage;
  let fixture: ComponentFixture<UnderreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnderreviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
