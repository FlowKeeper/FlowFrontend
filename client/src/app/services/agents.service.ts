import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../models/items.model';
import { StandartResponse } from '../models/response.model';
import { TriggerAssignment } from '../models/triggers.model';


export interface Agent {
    ID: string;
    Name: string;
    AgentUUID: string;
    Enabled: boolean;
    LastSeen: string;
    OS: number;
    State: number;
    Items: string[];
    ItemsResolved: Item[];
    Triggers: TriggerAssignment[];
    Endpoint?: string;
    Scraper: {
        UUID: string;
        Lock: string;
    }
}

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  constructor(private http: HttpClient) { }

  async getAgents(): Promise<Agent[]>{
    console.log("Fetching all agents from backend")
    var resp = await this.http.get<StandartResponse>("/api/v1/agent").toPromise()

    if (resp.Status == "OK"){
      return resp.Payload as Agent[]
    }

    console.error("Couldn't retrieve agents from server. Got:" + resp.Status)
    return [];
  }

}
