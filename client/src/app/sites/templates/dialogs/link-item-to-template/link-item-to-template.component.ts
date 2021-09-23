import { Component, Inject, OnInit, ViewChild } from "@angular/core"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatPaginator } from "@angular/material/paginator"
import { MatTableDataSource } from "@angular/material/table"
import { Item } from "src/app/models/items.model"

@Component({
    selector: "app-link-item-to-template",
    templateUrl: "./link-item-to-template.component.html",
    styleUrls: ["./link-item-to-template.component.css"],
})
export class LinkItemToTemplateComponent implements OnInit {
    items = new MatTableDataSource<Item>()
    itemLinkDisplayColumns: string[] = ["agent.name", "agent.description"]

    @ViewChild(MatPaginator) paginator!: MatPaginator
    ngAfterViewInit() {
        this.items.paginator = this.paginator
    }

    constructor(public dialogRef: MatDialogRef<LinkItemToTemplateComponent>) {}

    ngOnInit(): void {}

    onAbortClick() {
        this.dialogRef.close()
    }

    onOKClick(item: Item) {
        this.dialogRef.close(item)
    }
}
