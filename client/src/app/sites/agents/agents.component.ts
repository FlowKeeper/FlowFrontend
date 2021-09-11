import { Component, OnInit } from "@angular/core";
import { Agent } from "src/app/models/agents.model";
import { StandartResponse } from "src/app/models/response.model";
import { AgentsService } from "src/app/services/agents.service";

@Component({
  selector: "app-agents",
  templateUrl: "./agents.component.html",
  styleUrls: ["./agents.component.css"]
})
export class AgentsComponent implements OnInit {

  constructor(public agentService: AgentsService) { }

  agents: Agent[] = []
  agentsDisplayColumns: string[] = ["agent.name", "agent.description", "agent.endpoint", "agent.os", "agent.items", "agent.triggers", "actions"];

  ngOnInit(): void {
    this.agentService.getAgents().subscribe((data: StandartResponse) => {
      let newAgentArray: Agent[] = [];
      let rawAgents = data.Payload as Agent[];

      rawAgents.forEach((element) => {
        newAgentArray.push(new Agent(element));
      });

      this.agents = newAgentArray;
    });
  }

}
