import { Component, Inject, OnInit } from "@angular/core"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { Agent } from "src/app/models/agents.model"

@Component({
    selector: "app-delete-agent",
    templateUrl: "./delete-agent.component.html",
    styleUrls: ["./delete-agent.component.css"],
})
export class DeleteAgentComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<DeleteAgentComponent>,
        @Inject(MAT_DIALOG_DATA) public agent: Agent
    ) {}

    ngOnInit(): void {}

    onAbortClick() {
        this.dialogRef.close(false)
    }

    onOKClick() {
        this.dialogRef.close(true)
    }
}
