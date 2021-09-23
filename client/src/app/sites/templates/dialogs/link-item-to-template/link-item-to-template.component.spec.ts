import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkItemToTemplateComponent } from './link-item-to-template.component';

describe('LinkItemToTemplateComponent', () => {
  let component: LinkItemToTemplateComponent;
  let fixture: ComponentFixture<LinkItemToTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkItemToTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkItemToTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
