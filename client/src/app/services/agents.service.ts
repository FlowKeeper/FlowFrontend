import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable, throwError } from "rxjs"
import { catchError, retry } from "rxjs/operators"
import Swal from "sweetalert2"
import { Agent, AgentOS } from "../models/agents.model"
import { Item } from "../models/items.model"
import { StandartResponse } from "../models/response.model"
import { Trigger, TriggerAssignment } from "../models/triggers.model"
import { AlertsService } from "./alerts.service"

@Injectable({
    providedIn: "root",
})
export class AgentsService {
    constructor(private http: HttpClient, private alerts: AlertsService) {}

    getAgents(): Observable<StandartResponse> {
        return this.http.get<StandartResponse>("/api/v1/agents").pipe(
            catchError((err, caught) => {
                if (err instanceof HttpErrorResponse) {
                    this.alerts.displayGenericError(err.message)
                } else {
                    this.alerts.displayGenericError("Unknown error")
                }

                return throwError(err)
            })
        )
    }

    patchAgent(Agent: Agent, Update: any) {
        return this.http
            .patch<StandartResponse>(`/api/v1/agents/${Agent.ID}`, Update)
            .pipe(
                catchError((err, caught) => {
                    if (err instanceof HttpErrorResponse) {
                        this.alerts.displayGenericError(err.message)
                    } else {
                        this.alerts.displayGenericError("Unknown error")
                    }

                    return throwError(err)
                })
            )
    }
}
