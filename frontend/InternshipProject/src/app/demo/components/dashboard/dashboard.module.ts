import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { DashboardsRoutingModule } from './dashboard-routing.module';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [
        // Angular Modules
        CommonModule,
        FormsModule,
        
        // PrimeNG Modules
        ButtonModule,
        ChartModule,
        MenuModule,
        PanelMenuModule,
        StyleClassModule,
        TableModule,
        
        // Routing
        DashboardsRoutingModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule { }
