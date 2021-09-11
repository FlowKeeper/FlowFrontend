import { Component, Inject, OnInit } from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Agent } from "src/app/models/agents.model";

@Component({
  selector: "app-edit-agent",
  templateUrl: "./edit-agent.component.html",
  styleUrls: ["./edit-agent.component.css"]
})

export class EditAgentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditAgentComponent>,
    @Inject(MAT_DIALOG_DATA) public agent: Agent) {
    }

  ngOnInit(): void {
  }

  onAbortClick(){
    this.dialogRef.close();
  }

}
