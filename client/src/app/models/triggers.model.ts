import { Agent } from "./agents.model";

export interface TriggerAssignment {
    Enabled: boolean;
    TriggerID: string;
    Problematic: boolean;
    Error: string;
    History: TriggerHistoryEvent[];
}

export interface Trigger {
    ID: string;
    Name: string;
    Enabled: boolean;
    Severity: TriggerSeverity;
    DependsOn: string[];
    Expression: string;
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