import { Component, Input, OnInit, ViewChild } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatPaginator } from "@angular/material/paginator"
import { MatTableDataSource } from "@angular/material/table"
import { AgentOS } from "src/app/models/agents.model"
import { Item } from "src/app/models/items.model"
import {
    StandartResponse,
    StandartResponseType,
} from "src/app/models/response.model"
import { Template } from "src/app/models/templates.model"
import { AlertsService } from "src/app/services/alerts.service"
import { TemplatesService } from "src/app/services/templates.service"
import { UnlinkItemDialogComponent } from "src/app/general/item-table/dialogs/unlink-item-dialog/unlink-item-dialog.component"

@Component({
    selector: "app-item-table",
    templateUrl: "./item-table.component.html",
    styleUrls: ["./item-table.component.css"],
})
export class ItemTableComponent implements OnInit {
    items = new MatTableDataSource<Item>()
    originalItems: Item[] = []

    displayItemColumns: string[] = [
        "item.type",
        "item.name",
        "item.description",
        "item.command",
        "actions",
    ]

    @ViewChild(MatPaginator) paginator!: MatPaginator
    constructor(
        private dialog: MatDialog,
        private templateService: TemplatesService,
        private alertService: AlertsService
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.items.paginator = this.paginator
    }

    setItems(Items: Item[]) {
        //Clear original items to avoid Object.assign not cloning the array
        this.originalItems = []
        Object.assign(this.originalItems, Items)
        this.items.data = Items
        this.filterByOS(this.currentItemFilter)
    }

    unlinkActionVisible = false
    unlinkActionTemplate!: Template
    showUnlinkAction(Template: Template) {
        if (!this.unlinkActionVisible) {
            this.unlinkActionTemplate = Template
            this.unlinkActionVisible = true
        }
    }

    openUnlinkDialog(Item: Item) {
        const dialogRef = this.dialog.open(UnlinkItemDialogComponent, {
            width: "500px",
            data: Item,
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                result = result as boolean
                if (result === true) {
                    this.templateService
                        .unlinkItemFromTemplate(
                            this.unlinkActionTemplate.ID,
                            Item.ID
                        )
                        .subscribe((data: StandartResponse) => {
                            if (data.Status == StandartResponseType.Deleted) {
                                let updatedTemplate = data.Payload as Template
                                this.unlinkActionTemplate = updatedTemplate

                                this.setItems(updatedTemplate.Items)
                                this.alertService.popInSuccessNotification(
                                    "Item was successfully unlinked!"
                                )
                            }
                        })
                }
            }
        })
    }

    currentItemFilter = 2
    filterByOS(filter: number) {
        this.currentItemFilter = filter
        //2 == ALL items
        if (filter === 2) {
            this.items.data = this.originalItems
            return
        }

        //Filter by OS
        //1 = Linux
        //0 = Windows
        let newItemArray: Item[] = []
        this.originalItems.forEach((element) => {
            if (element.CheckOn == filter) {
                newItemArray.push(element)
            }
        })

        this.items.data = newItemArray
    }

    agentosToString(OS: number): string {
        return AgentOS[OS]
    }
}
