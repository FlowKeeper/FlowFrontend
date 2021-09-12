import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root"
})
export class AlertsService {

  constructor(private readonly snackBar: MatSnackBar, private _snackBar: MatSnackBar) { }

  displayGenericError(Error: string){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: Error
    });
  }

  //Thx to https://stackblitz.com/edit/angular-material-notification-service?file=src%2Fapp%2Fsnack-bar-overview-example.ts
  private openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: [className]
    });
  }

  popInSuccessNotification(Message: string){
    this.openSnackBar(Message, "", "success-snackbar")
  }
}
