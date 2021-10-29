import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSceneComponent } from './card-scene.component';

describe('CardSceneComponent', () => {
  let component: CardSceneComponent;
  let fixture: ComponentFixture<CardSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardSceneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
