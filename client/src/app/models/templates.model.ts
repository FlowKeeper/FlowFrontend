import { Item } from "./items.model"
import { Trigger } from "./triggers.model"

export interface Template {
    ID: string
    Name: string
    Description: string
    ItemIDs: string[]
    Items: Item[]
    TriggerIDs: string[]
    Triggers: Trigger[]
}
