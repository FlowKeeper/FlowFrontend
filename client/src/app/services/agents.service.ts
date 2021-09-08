import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Item } from '../models/items.model';
import { StandartResponse } from '../models/response.model';
import { TriggerAssignment } from '../models/triggers.model';
import { AlertsService } from './alerts.service';


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

  private agents: Agent[] = []

  constructor(private http: HttpClient, private alerts : AlertsService) {
    this.fetchAgents()
  }

  getAgents(): Agent[]{
    return this.agents
  }

  private async fetchAgents(){
    console.log("Fetching all agents from backend")
    try{
      var resp = await this.http.get<StandartResponse>("/api/v1/agent").toPromise()

      if (resp.Status == "OK"){
        this.agents = resp.Payload as Agent[];
        return
      }

      this.alerts.DisplayGenericError("Couldn't retrieve agents from server. Got:" + resp.Status)

    }catch(exception){
      let errorMessage = "Unknown error"

      if (exception instanceof HttpErrorResponse){
        const httpException = exception as HttpErrorResponse
        errorMessage = httpException.message
      }

      this.alerts.DisplayGenericError(errorMessage)
    }
    return [];
  }
}
