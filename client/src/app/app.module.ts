import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { LayoutModule } from "@angular/cdk/layout"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatIconModule } from "@angular/material/icon"
import { MatListModule } from "@angular/material/list"
import { HttpClientModule } from "@angular/common/http"
import { DashboardComponent } from "./sites/dashboard/dashboard.component"
import { AgentsComponent } from "./sites/agents/agents.component"
import { TemplatesComponent } from "./sites/templates/templates.component"
import { MatGridListModule } from "@angular/material/grid-list"
import { NgxEchartsModule } from "ngx-echarts"
import { MatCardModule } from "@angular/material/card"
import { MatMenuModule } from "@angular/material/menu"
import { MatTableModule } from "@angular/material/table"
import { EditAgentComponent } from "./sites/agents/dialogs/edit-agent/edit-agent.component"
import { MatDialogModule } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { DeleteAgentComponent } from './sites/agents/dialogs/delete-agent/delete-agent.component'

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        AgentsComponent,
        TemplatesComponent,
        EditAgentComponent,
        DeleteAgentComponent,
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatGridListModule,
        NgxEchartsModule.forRoot({
            echarts: () => import("echarts"),
        }),
        MatCardModule,
        MatMenuModule,
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatSnackBarModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
