import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class AlertsService {

  constructor() { }

  displayGenericError(Error: string){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: Error
  })
  }
}
