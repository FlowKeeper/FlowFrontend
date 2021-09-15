import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatPaginator } from "@angular/material/paginator"
import { MatTableDataSource } from "@angular/material/table"
import { StandartResponseType } from "src/app/models/response.model"
import { Template } from "src/app/models/templates.model"
import { AlertsService } from "src/app/services/alerts.service"
import { LoggerService } from "src/app/services/logger.service"
import { TemplatesService } from "src/app/services/templates.service"
import { Router, ActivatedRoute, ParamMap } from "@angular/router"

@Component({
    selector: "app-templates",
    templateUrl: "./templates.component.html",
    styleUrls: ["./templates.component.css"],
})
export class TemplatesComponent implements OnInit, AfterViewInit {
    templates = new MatTableDataSource<Template>()
    templateDisplayColumns: string[] = [
        "template.name",
        "template.description",
        "template.items",
        "template.triggers",
        "actions",
    ]

    @ViewChild(MatPaginator) paginator!: MatPaginator

    ngAfterViewInit() {
        this.templates.paginator = this.paginator
    }

    constructor(
        private templateService: TemplatesService,
        private alertService: AlertsService,
        private logger: LoggerService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.templateService.getTemplates().subscribe((data) => {
            if (data.Status != StandartResponseType.OK) {
                this.alertService.displayGenericError(
                    "Couldn't fetch templates. " + data.Status
                )
                return
            }

            //Status is ok
            this.templates.data = data.Payload as Template[]
            this.logger.info("Got " + this.templates.data.length + " templates")
        })
    }

    openTemplateEdit(template: Template) {
        this.router.navigate(["edit/" + template.ID], {
            relativeTo: this.route,
        })
    }
}
