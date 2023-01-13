import { Component, OnInit, ViewChild } from '@angular/core';

import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexYAxis,
    ApexDataLabels,
    ApexTitleSubtitle,
    ApexStroke,
    ApexGrid,
    ApexLegend,
    ApexTooltip,
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries | any;
    chart: ApexChart | any;
    xaxis: ApexXAxis | any;
    yaxis: ApexYAxis | any;
    dataLabels: ApexDataLabels | any;
    grid: ApexGrid | any;
    stroke: ApexStroke | any;
    title: ApexTitleSubtitle | any;
    legend: ApexLegend | any;
    tooltip: ApexTooltip | any;
};


@Component({
    selector: 'app-graph-assigned-patient',
    templateUrl: './graph-assigned-patient.component.html',
    styleUrls: ['./graph-assigned-patient.component.css']
})
export class GraphAssignedPatientComponent implements OnInit {
    @ViewChild("chart") chart!: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    
    constructor() {
        this.chartOptions = {
            series: [
                {
                    name: "Likes",
                    data: [4, 3, 10, 9, 50, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 15]
                }
            ],
            chart: {
                toolbar: {
                    show: false,
                },
                height: 120,
                type: 'line',
            },
            stroke: {
                width: 4,
                curve: 'smooth',
                colors: ['#23a287']
            },
            title: {
                text: "Product Trends by Month",
                align: "left"
            },
            legend: {
                show: false
            },
            tooltip: {
				enabled: true,
            },
            grid: {
                show: false,
            },
            xaxis: {
                labels: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                }
            },
            yaxis: {
                show: false,
            },
        };
    }
    
    ngOnInit(): void {
    }
    
}
