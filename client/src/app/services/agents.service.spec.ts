import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { AgentsService } from "./agents.service";

describe("AgentsService", () => {
  let service: AgentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(AgentsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
