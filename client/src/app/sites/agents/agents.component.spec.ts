import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

import { AgentsComponent } from "./agents.component";

describe("AgentsComponent", () => {
  let component: AgentsComponent;
  let fixture: ComponentFixture<AgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentsComponent ],
      imports:[
        HttpClientModule,
        MatToolbarModule,
        MatSidenavModule,
        MatTableModule,
        MatIconModule,
        MatListModule,
        MatDialogModule,
        MatSnackBarModule
      ],
      providers: [
        {
          provide: MatSnackBarModule,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
