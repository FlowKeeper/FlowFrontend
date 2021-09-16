import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core"
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatPaginator } from "@angular/material/paginator"
import { MatTableDataSource } from "@angular/material/table"
import { ActivatedRoute } from "@angular/router"
import { Subscription } from "rxjs"
import { Agent, AgentOS } from "src/app/models/agents.model"
import { Item } from "src/app/models/items.model"
import { StandartResponseType } from "src/app/models/response.model"
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

    @ViewChild(MatPaginator) paginator!: MatPaginator
    displayedItems = new MatTableDataSource<Item>()
    displayItemColumns: string[] = [
        "item.type",
        "item.name",
        "item.description",
        "item.command",
        "actions",
    ]

    constructor(
        private route: ActivatedRoute,
        private templateService: TemplatesService,
        private alertService: AlertsService,
        private formBuilder: FormBuilder
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

                this.filterByOS(2)
            })
        })
    }

    ngAfterViewInit() {
        this.displayedItems.paginator = this.paginator
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe()
    }

    filterByOS(filter: number) {
        //2 == ALL items
        if (filter === 2) {
            this.displayedItems.data = this.template.Items
            return
        }

        //Filter by OS
        //1 = Linux
        //0 = Windows
        let newItemArray: Item[] = []
        this.template.Items.forEach((element) => {
            if (element.CheckOn == filter) {
                newItemArray.push(element)
            }
        })

        this.displayedItems.data = newItemArray
    }

    agentosToString(OS: number): string {
        return AgentOS[OS]
    }

    openUnlinkDialog(Item: Item) {
        //ToDo
    }
}
