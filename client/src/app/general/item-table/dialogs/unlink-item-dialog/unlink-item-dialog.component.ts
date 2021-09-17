import { Component, Inject, OnInit } from "@angular/core"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { Item } from "src/app/models/items.model"
import { Template } from "src/app/models/templates.model"

@Component({
    selector: "app-unlink-item-dialog",
    templateUrl: "./unlink-item-dialog.component.html",
    styleUrls: ["./unlink-item-dialog.component.css"],
})
export class UnlinkItemDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<UnlinkItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public item: Item
    ) {}

    ngOnInit(): void {}

    onAbortClick() {
        this.dialogRef.close(false)
    }

    onOKClick() {
        this.dialogRef.close(true)
    }
}
