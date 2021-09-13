import { Item } from "./items.model"
import { Template } from "./templates.model"
import { Trigger, TriggerAssignment } from "./triggers.model"

export enum AgentOS {
    Windows = 0,
    Linux,
}

export class Agent {
    ID: string
    Name: string
    Description: string
    AgentUUID: string
    Enabled: boolean
    LastSeen: string
    OS: AgentOS
    Templates: Template[]
    TriggerMappings: TriggerAssignment[]
    Endpoint?: string
    Scraper: {
        UUID: string
        Lock: string
    }

    constructor(json: any) {
        this.ID = json.ID
        this.Name = json.Name
        this.Description = json.Description
        this.AgentUUID = json.AgentUUID
        this.Enabled = json.Enabled
        this.LastSeen = json.LastSeen
        this.OS = json.OS
        this.Templates = json.Templates
        this.TriggerMappings = json.TriggerMappings
        this.Endpoint = json.Endpoint
        this.Scraper = {
            Lock: json.Scraper.Lock,
            UUID: json.Scraper.UUID,
        }

        this.Templates.forEach((template, index) => {
            template.Triggers.forEach((trigger, triggerIndex) => {
                this.Templates[index].Triggers[triggerIndex] = new Trigger(
                    trigger
                )
            })
        })
    }

    agentosToString(): string {
        return AgentOS[this.OS]
    }

    getAllItems(): Item[] {
        let items: Item[] = []
        this.Templates.forEach((template) => {
            template.Items.forEach((item) => {
                if (!items.includes(item)) {
                    items.push(item)
                }
            })
        })

        return items
    }

    getAllTriggers(): Trigger[] {
        let triggers: Trigger[] = []
        this.Templates.forEach((template) => {
            template.Triggers.forEach((trigger) => {
                if (!triggers.includes(trigger)) {
                    triggers.push(trigger)
                }
            })
        })

        return triggers
    }

    getTriggerByID(TriggerID: string) {
        var trigger: Trigger | undefined = undefined
        this.getAllTriggers().forEach((element) => {
            if (element.ID === TriggerID) {
                trigger = element
            }
        })

        return trigger
    }

    getTriggerMappingForTrigger(
        TriggerID: string
    ): TriggerAssignment | undefined {
        var tm: TriggerAssignment | undefined = undefined
        this.TriggerMappings.forEach((element) => {
            if (element.TriggerID === TriggerID) {
                tm = element
            }
        })

        return tm
    }

    //This function returns the amount of problematic triggers for an agent
    problematicTriggers(agent: Agent): number {
        let triggerProblematic = 0
        this.getAllTriggers().forEach((element) => {
            let tm = this.getTriggerMappingForTrigger(element.ID)
            if (typeof tm !== undefined) {
                if (tm?.Problematic) {
                    triggerProblematic++
                }
            }
        })

        return triggerProblematic
    }

    //This function returns the amount of ok triggers for an agent
    unproblematicTriggers(agent: Agent): number {
        let triggerOK = 0
        this.getAllTriggers().forEach((element) => {
            let tm = this.getTriggerMappingForTrigger(element.ID)
            if (typeof tm !== undefined) {
                if (!tm?.Problematic) {
                    triggerOK++
                }
            }
        })

        return triggerOK
    }
}
