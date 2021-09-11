import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { EChartsOption } from "echarts";
import * as echarts from "echarts";
import { AgentsService } from "src/app/services/agents.service";
import { TriggerAgentMapping } from "src/app/models/triggers.model";
import { StandartResponse } from "src/app/models/response.model";
import { Agent } from "src/app/models/agents.model";


@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  agents: Agent[] = []

  problemsDataSource: TriggerAgentMapping[] = []
  problemsDisplayedColumns: string[] = ["agent.name", "trigger.name", "trigger.description", "trigger.severity", "trigger.starttime"];

  constructor(public agentService : AgentsService) { }

  ngOnInit() {
    //Populate problems array
    this.agentService.getAgents().subscribe((data: StandartResponse) => {
      let newAgentArray: Agent[] = [];
      let rawAgents = data.Payload as Agent[];

      rawAgents.forEach((element) => {
        newAgentArray.push(new Agent(element))
      });

      this.agents = newAgentArray;

      this.displayProblems()
    });
  }

  displayProblems(){
    let newProblems: TriggerAgentMapping[] = [];

    this.agents.forEach((element) => {
      element.getAllTriggers().forEach((trigger) => {
        let tm = element.getTriggerMappingForTrigger(trigger.ID);
        if (tm !== undefined){
          if (tm.Problematic){
            let mapping: TriggerAgentMapping = {
              Agent: element,
              Assignment: tm
            };

            newProblems.push(mapping);
          }
        }
      });
    });

    this.problemsDataSource = newProblems;
  }

}
