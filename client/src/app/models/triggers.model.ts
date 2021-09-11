import { Agent } from "./agents.model";

export interface TriggerAssignment {
    Enabled: boolean;
    TriggerID: string;
    Problematic: boolean;
    Error: string;
    History: TriggerHistoryEvent[];
}

export class Trigger {
    ID: string;
    Name: string;
    Enabled: boolean;
    Severity: TriggerSeverity;
    DependsOn: string[];
    Expression: string;

    constructor(json:any){
        this.ID = json.ID;
        this.Name = json.Name;
        this.Enabled = json.Enabled;
        this.Severity = json.Severity;
        this.DependsOn = json.DependsOn;
        this.Expression = json.Expression;
    }

    severityToString(): string {
        return TriggerSeverity[this.Severity]
    }

    severityToColor(): string{
    switch(this.Severity){
        case TriggerSeverity.Info:{
            return "#e8e8e8";
        }
        case TriggerSeverity.Low:{
            return "rgb(127 211 247 / 56%)";
        }
        case TriggerSeverity.Medium:{
            return "#ffc564de";
        }
        case TriggerSeverity.High:{
            return "#ff7f7f";
        }
        default:{
            return "";
        }
    }
    }
}

export interface TriggerAgentMapping{
    Agent: Agent;
    Assignment: TriggerAssignment;
}

export interface TriggerHistoryEvent{
    Time: Date;
    Problematic: boolean;
}

export enum TriggerSeverity {
    Info = 0,
    Low ,
    Medium,
    High
}