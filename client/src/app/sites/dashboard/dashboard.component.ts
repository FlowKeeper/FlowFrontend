import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { Agent, AgentsService } from 'src/app/services/agents.service';
import { TriggerAgentMapping } from 'src/app/models/triggers.model';
import { StandartResponse } from 'src/app/models/response.model';
import { TriggerService } from 'src/app/services/trigger.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  problemsDataSource: TriggerAgentMapping[] = []
  problemsDisplayedColumns: string[] = ['agent.name', 'trigger.name', 'trigger.description', 'trigger.severity'];

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
      element.Triggers.forEach(trigger => {
        if (trigger.Problematic){
          let mapping: TriggerAgentMapping = {
            Agent: element,
            Trigger: trigger.Trigger
          }

          newProblems.push(mapping)
        }
      });
    });

    this.problemsDataSource = newProblems
    console.log("Discovered " + this.problemsDataSource.length + " problematic agents")
  }

}
