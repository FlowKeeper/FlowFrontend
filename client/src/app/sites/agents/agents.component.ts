import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Agent } from "src/app/models/agents.model";
import { StandartResponse } from "src/app/models/response.model";
import { AgentsService } from "src/app/services/agents.service";
import { EditAgentComponent } from "./dialogs/edit-agent/edit-agent.component";

@Component({
  selector: "app-agents",
  templateUrl: "./agents.component.html",
  styleUrls: ["./agents.component.css"]
})
export class AgentsComponent implements OnInit {

  constructor(public agentService: AgentsService, public dialog: MatDialog) { }

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

  openEditAgent(agent: Agent){
    //Clone object
    let clonedAgent = new Agent(JSON.parse(JSON.stringify(agent)));

    const dialogRef = this.dialog.open(EditAgentComponent, {
      width: "500px",
      data: clonedAgent
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result !== undefined){
        let recievedAgent = result as Agent

        agent.compare(recievedAgent)
      }
    });
  }
}
