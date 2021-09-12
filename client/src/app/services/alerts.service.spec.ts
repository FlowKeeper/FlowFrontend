import { TestBed } from "@angular/core/testing";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { AlertsService } from "./alerts.service";

describe("AlertsService", () => {
  let service: AlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        MatSnackBarModule
      ],
      providers:[
        {
          provide: MatSnackBarModule,
          useValue: {}
        },
      ]
    });
    service = TestBed.inject(AlertsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
