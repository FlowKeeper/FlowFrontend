import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlinkItemDialogComponent } from './unlink-item-dialog.component';

describe('UnlinkItemDialogComponent', () => {
  let component: UnlinkItemDialogComponent;
  let fixture: ComponentFixture<UnlinkItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnlinkItemDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlinkItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
