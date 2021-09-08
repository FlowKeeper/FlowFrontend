import { Agent } from "../services/agents.service";

export interface TriggerAssignment {
    Enabled: boolean;
    TriggerID: string;
    Trigger: Trigger;
    Problematic: boolean;
    Error: string;
}

export interface Trigger {
    ID: string;
    Name: string;
    Enabled: boolean;
    Severity: number;
    DependsOn: string[];
    Expression: string;
}

export interface TriggerAgentMapping{
    Agent: Agent;
    Trigger: Trigger;
}