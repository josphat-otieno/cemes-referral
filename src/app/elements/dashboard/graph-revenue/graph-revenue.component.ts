import { Component, OnInit, ViewChild } from "@angular/core";
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
    ApexResponsive,
    ApexGrid,
    ApexMarkers,
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries | any;
    chart: ApexChart | any;
    dataLabels: ApexDataLabels | any;
    plotOptions: ApexPlotOptions | any;
    yaxis: ApexYAxis | any;
    xaxis: ApexXAxis | any;
    fill: ApexFill | any;
    tooltip: ApexTooltip | any;
    stroke: ApexStroke | any;
    legend: ApexLegend | any;
    colors: string[] | any;
    responsive: ApexResponsive[] | any;
    grid: ApexGrid | any;
    markers: ApexMarkers | any;
};


@Component({
    selector: 'app-graph-revenue',
    templateUrl: './graph-revenue.component.html',
    styleUrls: ['./graph-revenue.component.css']
})
export class GraphRevenueComponent implements OnInit {
    
    
    @ViewChild("chart") chart!: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    
    constructor() {
        this.chartOptions = {
            series: [
                {
                    name: 'Net Profit',
                    data: [44, 55, 90, 80, 25, 15, 70, 55, 35, 15, 70, 55, 95, 35],
                },
                {
                    name: 'Revenue',
                    data: [15, 65, 15, 35, 30, 5, 40, 60, 10, 5, 40, 60, 10, 35]
                } 
            ],
            chart: {
                type: 'bar',
                height: 350,
                
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 5,
                },
            },
            
            colors:['#450b5a', '#ff2c53'],
            dataLabels: {
                enabled: false,
            },
            markers: {
                shape: "circle",
            },
            legend: {
                show: true,
                fontSize: '12px',
                labels: {
                    colors: '#000000',
                    
                },
                markers: {
                    width: 18,
                    height: 18,
                    strokeWidth: 0,
                    strokeColor: '#fff',
                    fillColors: undefined,
                    radius: 12,	
                }
            },
            stroke: {
                show: true,
                width: 1,
                colors: ['transparent']
            },
            grid: {
                show: false,
            },
            xaxis: {
                categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
                labels: {
                    style: {
                        colors: '#787878',
                        fontSize: '13px',
                        fontFamily: 'poppins',
                        fontWeight: 100,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                },
                crosshairs: {
                    show: false,
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#787878',
                        fontSize: '13px',
                        fontFamily: 'poppins',
                        fontWeight: 100,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                },
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val:any) {
                        return "$ " + val + " thousands"
                    }
                }
            },
            responsive: [{
                breakpoint: 575,
                options: {
                    chart: {
                        height: 200,
                    }
                }
            }]
        };
    }
    
    ngOnInit(): void {
    }
    
}
