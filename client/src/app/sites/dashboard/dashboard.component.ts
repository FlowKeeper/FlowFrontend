import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { Agent, AgentsService } from 'src/app/services/agents.service';
import { TriggerAgentMapping, TriggerAssignment } from 'src/app/models/triggers.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  problemsDataSource: TriggerAgentMapping[] = []
  problemsDisplayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', 'demo-symbol'];

  constructor(private agentService : AgentsService) { }

  async ngOnInit() {
    let agents = await this.agentService.getAgents()

    agents.forEach(element => {
      element.Triggers.forEach(trigger => {
        if (trigger.Problematic){
          let mapping: TriggerAgentMapping = {
            Agent: element,
            Trigger: trigger.Trigger
          }

          this.problemsDataSource.push(mapping)
        }
      });
    });

    console.log("Discovered " + this.problemsDataSource.length + " problematic agents")
  }
}
