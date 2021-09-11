import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Agent, AgentOS } from '../models/agents.model';
import { Item } from '../models/items.model';
import { StandartResponse } from '../models/response.model';
import { Trigger, TriggerAssignment } from '../models/triggers.model';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  constructor(private http: HttpClient, private alerts : AlertsService) {}

  getAgents(): Observable<StandartResponse>{
    return this.http.get<StandartResponse>("/api/v1/agent").pipe(
      catchError((err, caught) => {
        if (err instanceof HttpErrorResponse){
          this.alerts.DisplayGenericError(err.message)
        }else{
          this.alerts.DisplayGenericError("Unknown error")
        }

        return throwError(err)
      })
    )
  }

  agentosToString(os: AgentOS): string{
    return AgentOS[os]
  }

  getAllItems(Agent: Agent): Item[]{
    let items: Item[] = []
    Agent.Templates.forEach(template => {
      template.Items.forEach(item => {
        if (!items.includes(item)){
          items.push(item)
        }
      });
    });

    return items
  }

  getAllTriggers(Agent: Agent): Trigger[]{
    let triggers: Trigger[] = []
    Agent.Templates.forEach(template => {
      template.Triggers.forEach(trigger => {
        if (!triggers.includes(trigger)){
          triggers.push(trigger)
        }
      });
    });

    return triggers
  }

  getTriggerMappingForTrigger(Agent: Agent, Trigger: Trigger): TriggerAssignment | undefined{
    var tm: TriggerAssignment | undefined = undefined;
    Agent.TriggerMappings.forEach(element => {
      if (element.TriggerID == Trigger.ID){
        tm = element
      }
    });

    if (tm === undefined){
      console.log("Trigger assignments seem to be inconsistent. Didn't find assignment for trigger " + Trigger.ID)
    }
    return tm
  }
}
