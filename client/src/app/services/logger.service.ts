import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"

@Injectable({
    providedIn: "root",
})
export class LoggerService {
    constructor() {}
    info(MSG: string) {
        if (!environment.production) {
            console.log(MSG)
        }
    }
    warn(MSG: string) {
        if (!environment.production) {
            console.warn(MSG)
        }
    }
    error(MSG: string) {
        if (!environment.production) {
            console.error(MSG)
        }
    }
}
