import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { StandartResponse } from "../models/response.model"
import { AlertsService } from "./alerts.service"
@Injectable({
    providedIn: "root",
})
export class TemplatesService {
    constructor(private http: HttpClient, private alerts: AlertsService) {}

    getTemplates(): Observable<StandartResponse> {
        return this.http.get<StandartResponse>("/api/v1/templates").pipe(
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

    getTemplateByID(TemplateID: string): Observable<StandartResponse> {
        return this.http
            .get<StandartResponse>("/api/v1/templates/" + TemplateID)
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

    unlinkItemFromTemplate(
        TemplateID: string,
        ItemID: string
    ): Observable<StandartResponse> {
        return this.http
            .delete<StandartResponse>(
                "/api/v1/templates/" + TemplateID + "/items/" + ItemID
            )
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
    unlinkTriggerFromTemplate(
        TemplateID: string,
        TriggerID: string
    ): Observable<StandartResponse> {
        return this.http
            .delete<StandartResponse>(
                "/api/v1/templates/" + TemplateID + "/triggers/" + TriggerID
            )
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
