import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { AgentsService } from 'src/app/services/agents.service';
import { TriggerAgentMapping } from 'src/app/models/triggers.model';
import { StandartResponse } from 'src/app/models/response.model';
import { TriggerService } from 'src/app/services/trigger.service';
import { Agent } from 'src/app/models/agents.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  problemsDataSource: TriggerAgentMapping[] = []
  problemsDisplayedColumns: string[] = ['agent.name', 'trigger.name', 'trigger.description', 'trigger.severity', "trigger.starttime"];

  constructor(private agentService : AgentsService, public triggerService: TriggerService) { }

  ngOnInit() {
    //Populate problems array
    this.agentService.getAgents().subscribe((data: StandartResponse) => {
      this.displayProblems(data.Payload as Agent[])
    })
  }

  displayProblems(agents: Agent[]){
    let newProblems: TriggerAgentMapping[] = []

    agents.forEach(element => {
      this.agentService.getAllTriggers(element).forEach(trigger => {
        let tm = this.agentService.getTriggerMappingForTrigger(element,trigger)
        if (tm !== undefined){
          if (tm.Problematic){
            let mapping: TriggerAgentMapping = {
              Agent: element,
              Assignment: tm
            }

            newProblems.push(mapping)
          }
        }
      });
    });

    this.problemsDataSource = newProblems
    console.log("Discovered " + this.problemsDataSource.length + " problematic agents")
  }

}
