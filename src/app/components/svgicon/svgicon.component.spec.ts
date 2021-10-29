import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGIconComponent } from './svgicon.component';

describe('SVGIconComponent', () => {
  let component: SVGIconComponent;
  let fixture: ComponentFixture<SVGIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SVGIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SVGIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
