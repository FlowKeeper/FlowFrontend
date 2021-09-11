import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AgentsComponent } from "./sites/agents/agents.component";
import { DashboardComponent } from "./sites/dashboard/dashboard.component";
import { TemplatesComponent } from "./sites/templates/templates.component";

const routes: Routes = [
  {path: "dashboard", component: DashboardComponent},
  {path: "agents", component: AgentsComponent},
  {path: "templates", component: TemplatesComponent},
  {path: "**", redirectTo: "dashboard"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
