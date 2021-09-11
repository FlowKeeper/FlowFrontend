import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Trigger, TriggerSeverity } from '../models/triggers.model';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {

  constructor() { }

  triggerSeverityToString(severity: TriggerSeverity): string {
    return TriggerSeverity[severity]
  }

  triggerSeverityToColor(severity: TriggerSeverity): string{
    switch(severity){
        case TriggerSeverity.Info:{
            return "#e8e8e8"
        }
        case TriggerSeverity.Low:{
            return "rgb(127 211 247 / 56%)"
        }
        case TriggerSeverity.Medium:{
            return "#ffc564de"
        }
        case TriggerSeverity.High:{
            return "#ff7f7f"
        }
        default:{
            console.log("Got invalid triggerseverity: "+ severity)
            return ""
        }
    }
  }

}
