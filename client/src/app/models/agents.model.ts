import { Item } from "./items.model";
import { Template } from "./templates.model";
import { TriggerAssignment } from "./triggers.model";

export interface Agent {
    ID: string;
    Name: string;
    AgentUUID: string;
    Enabled: boolean;
    LastSeen: string;
    OS: AgentOS;
    State: number;
    Templates: Template[];
    TriggerMappings: TriggerAssignment[];
    Endpoint?: string;
    Scraper: {
        UUID: string;
        Lock: string;
    }
}

export enum AgentOS {
  Windows = 0,
  Linux
}