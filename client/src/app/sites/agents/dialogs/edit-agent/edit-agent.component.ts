import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Agent } from "src/app/models/agents.model";

@Component({
  selector: "app-edit-agent",
  templateUrl: "./edit-agent.component.html",
  styleUrls: ["./edit-agent.component.css"]
})

export class EditAgentComponent implements OnInit {

  formGroup: FormGroup
  changedMap: { [key: string]: any } = {};

  constructor(public dialogRef: MatDialogRef<EditAgentComponent>, formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public agent: Agent) {
      this.formGroup = formBuilder.group({
        "agentName": [agent.Name, [Validators.required]],
        "agentDescription": [agent.Description],
        "agentEndpoint": [agent.Endpoint, [Validators.required, this.verifyHostname()]],
        "agentEnabled": [agent.Enabled]
      });
  }

  verifyHostname(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      let forbidden = false;
      try{
        new URL("http://" + control.value);
      }catch(exception){
        forbidden = true;
      }
      return forbidden ? {verifyHostname: {value: control.value}} : null;
    };
  }

  ngOnInit(): void {}

  onAbortClick(){
    this.dialogRef.close();
  }

  onOKClick(){
    if (this.formGroup.invalid){
      return;
    }

    if (this.agent.Name !== this.formGroup.value.agentName){
      this.changedMap["name"] = this.formGroup.value.agentName;
    }

    if (this.agent.Description !== this.formGroup.value.agentDescription){
      this.changedMap["description"] = this.formGroup.value.agentDescription;
    }

    if (this.agent.Enabled !== this.formGroup.value.agentEnabled){
      this.changedMap["enabled"] = this.formGroup.value.agentEnabled;
    }

    /*
    if (this.agent.Templates !== agent.Templates){
      changedMap["templates"] = agent.Templates;
    }*/

    if (this.agent.Endpoint !== this.formGroup.value.agentEndpoint){
      this.changedMap["endpoint"] = this.formGroup.value.agentEndpoint;
    }

    this.dialogRef.close(this.changedMap);
  }

}
