import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { MatPaginator } from "@angular/material/paginator"
import { MatTableDataSource } from "@angular/material/table"
import { ActivatedRoute } from "@angular/router"
import { Subscription } from "rxjs"
import { ItemTableComponent } from "src/app/general/item-table/item-table.component"
import { Agent, AgentOS } from "src/app/models/agents.model"
import { Item } from "src/app/models/items.model"
import {
    StandartResponse,
    StandartResponseType,
} from "src/app/models/response.model"
import { Template } from "src/app/models/templates.model"
import { AlertsService } from "src/app/services/alerts.service"
import { TemplatesService } from "src/app/services/templates.service"

@Component({
    selector: "app-edit-template",
    templateUrl: "./edit-template.component.html",
    styleUrls: ["./edit-template.component.css"],
})
export class EditTemplateComponent implements OnInit, OnDestroy {
    //Thx: https://stackoverflow.com/questions/42839074/extract-id-from-url-using-angular2
    private routeSub!: Subscription
    formGroup: FormGroup
    template!: Template

    currentItemFilter = 2
    @ViewChild(ItemTableComponent) linkedItemsTable!: ItemTableComponent

    constructor(
        private route: ActivatedRoute,
        private templateService: TemplatesService,
        private alertService: AlertsService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog
    ) {
        this.formGroup = this.formBuilder.group({
            templateName: [],
            templateDescription: [],
        })
    }

    ngOnInit(): void {
        this.routeSub = this.route.params.subscribe((params) => {
            let id = params["id"] as string
            this.templateService.getTemplateByID(id).subscribe((data) => {
                if (data.Status != StandartResponseType.OK) {
                    this.alertService.displayGenericError(
                        "Couldn't fetch agent. Got:" + data.Status
                    )
                    return
                }

                this.template = data.Payload as Template
                this.formGroup = this.formBuilder.group({
                    templateName: [this.template.Name, [Validators.required]],
                    templateDescription: [this.template.Description],
                })
                this.linkedItemsTable.setItems(this.template.Items)
                this.linkedItemsTable.showUnlinkAction(this.template)
            })
        })
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe()
    }
}
