import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProject } from './update-project';

describe('UpdateProject', () => {
  let component: UpdateProject;
  let fixture: ComponentFixture<UpdateProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProject],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
