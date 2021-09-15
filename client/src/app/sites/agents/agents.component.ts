import { Component, OnInit, ViewChild } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatPaginator } from "@angular/material/paginator"
import { MatTableDataSource } from "@angular/material/table"
import { Agent } from "src/app/models/agents.model"
import {
    StandartResponse,
    StandartResponseType,
} from "src/app/models/response.model"
import { AgentsService } from "src/app/services/agents.service"
import { AlertsService } from "src/app/services/alerts.service"
import { LoggerService } from "src/app/services/logger.service"
import { DeleteAgentComponent } from "./dialogs/delete-agent/delete-agent.component"
import { EditAgentComponent } from "./dialogs/edit-agent/edit-agent.component"

@Component({
    selector: "app-agents",
    templateUrl: "./agents.component.html",
    styleUrls: ["./agents.component.css"],
})
export class AgentsComponent implements OnInit {
    agents = new MatTableDataSource<Agent>()
    agentsDisplayColumns: string[] = [
        "agent.enabled",
        "agent.name",
        "agent.description",
        "agent.endpoint",
        "agent.os",
        "agent.items",
        "agent.triggers",
        "actions",
    ]

    @ViewChild(MatPaginator) paginator!: MatPaginator

    ngAfterViewInit() {
        this.agents.paginator = this.paginator
    }

    constructor(
        public agentService: AgentsService,
        private alertService: AlertsService,
        public dialog: MatDialog,
        private logger: LoggerService
    ) {}

    ngOnInit(): void {
        this.agentService.getAgents().subscribe((data: StandartResponse) => {
            let newAgentArray: Agent[] = []
            let rawAgents = data.Payload as Agent[]

            rawAgents.forEach((element) => {
                newAgentArray.push(new Agent(element))
            })

            this.agents.data = newAgentArray
            this.logger.info("Got " + this.agents.data.length + " agents")
        })
    }

    openEditAgent(agent: Agent) {
        //Clone object
        let clonedAgent = new Agent(JSON.parse(JSON.stringify(agent)))

        const dialogRef = this.dialog.open(EditAgentComponent, {
            width: "500px",
            data: clonedAgent,
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                //Check if result set is empty
                if (Object.keys(result).length === 0) {
                    this.alertService.popInSuccessNotification(
                        "No changes were made."
                    )
                    return
                }
                //Send changed map to backend
                this.agentService
                    .patchAgent(agent, result)
                    .subscribe((data: StandartResponse) => {
                        if (data.Status == StandartResponseType.Patched) {
                            //Create new agent array and override the old one
                            //This is needed in order to trigger a redraw of the table
                            let newAgentArray: Agent[] = []

                            this.agents.data.forEach((element, index) => {
                                if (element.ID == agent.ID) {
                                    element = new Agent(data.Payload)
                                }
                                newAgentArray.push(element)
                            })

                            this.agents.data = newAgentArray

                            this.alertService.popInSuccessNotification(
                                "Agent successfully updated!"
                            )
                        }
                    })
            }
        })
    }

    openDeleteDialog(agent: Agent) {
        const dialogRef = this.dialog.open(DeleteAgentComponent, {
            width: "500px",
            data: agent,
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                result = result as boolean
                if (result === true) {
                    this.agentService
                        .deleteAgent(agent)
                        .subscribe((data: StandartResponse) => {
                            if (data.Status == StandartResponseType.Deleted) {
                                let newAgentArray: Agent[] = []

                                this.agents.data.forEach((element, index) => {
                                    if (element.ID != agent.ID) {
                                        newAgentArray.push(element)
                                    }
                                })

                                this.agents.data = newAgentArray

                                this.alertService.popInSuccessNotification(
                                    "Agent was marked for deletion!"
                                )
                            }
                        })
                }
            }
        })
    }
}
