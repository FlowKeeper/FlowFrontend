import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Agent } from 'src/app/models/agents.model';
import { StandartResponse } from 'src/app/models/response.model';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {

  constructor(public agentService: AgentsService) { }

  agents: Agent[] = []
  agentsDisplayColumns: string[] = ['agent.name', 'agent.description', 'agent.endpoint', 'agent.os', "agent.items", "agent.triggers", "actions"];

  ngOnInit(): void {
    this.agentService.getAgents().subscribe((data: StandartResponse) => {
      this.agents = data.Payload as Agent[]
      console.log("Got " + this.agents.length + " agent(s)")
    })
  }

  //This function returns the amount of problematic triggers for an agent
  problematicTriggers(agent: Agent): number{
    let triggerProblematic = 0
    this.agentService.getAllTriggers(agent).forEach(element => {
      let tm = this.agentService.getTriggerMappingForTrigger(agent, element)
      if (typeof tm !== undefined){
        if (tm?.Problematic){
          triggerProblematic++
        }
      }
    });

    return triggerProblematic
  }

  //This function returns the amount of ok triggers for an agent
  okTriggers(agent: Agent): number{
    let triggerOK = 0
    this.agentService.getAllTriggers(agent).forEach(element => {
      let tm = this.agentService.getTriggerMappingForTrigger(agent, element)
      if (typeof tm !== undefined){
        if (!tm?.Problematic){
          triggerOK++
        }
      }
    });

    return triggerOK
  }

}
