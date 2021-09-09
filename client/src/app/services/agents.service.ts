import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient, private alerts : AlertsService) {}

  getAgents(): Observable<StandartResponse>{
    return this.http.get<StandartResponse>("/api/v1/agent")
  }
}
