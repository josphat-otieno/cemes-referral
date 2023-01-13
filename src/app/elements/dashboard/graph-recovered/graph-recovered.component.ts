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
  ApexGrid
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
};


@Component({
  selector: 'app-graph-recovered',
  templateUrl: './graph-recovered.component.html',
  styleUrls: ['./graph-recovered.component.css']
})
export class GraphRecoveredComponent implements OnInit {

  
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
        series: [
             {
                name: "New Clients",
                data: [75, 150, 225, 200, 35, 50, 150]
            },
            {
                name: "Retained Clients",
                data: [-100, -55, -40, -120, -70, -40, -60]
            } 
        ],
        chart: {
            type: "bar",
            height: 250,
            stacked: true,
            toolbar: {
                show: false
            },
            sparkline: {
                //enabled: true
            },
            offsetX: -10,
        },
        plotOptions: {
            bar: {
                columnWidth: "25%",
                // endingShape: "rounded",
                borderRadius: 5,
                
                colors: {
                    backgroundBarColors: ['#f0f0f0', '#f0f0f0', '#f0f0f0', '#f0f0f0'],
                    backgroundBarOpacity: 1,
                    backgroundBarRadius: 5,
                },

            distributed: false
            },
        },
        colors:['#209f84', '#ff2c53'],
        grid: {
            show: false,
        },
        legend: {
            show: false
        },
        fill: {
          opacity: 1
        },
        dataLabels: {
            enabled: false,
            style: {
				colors: ['#000'],
            },
            dropShadow: {
              enabled: true,
              top: 1,
              left: 1,
              blur: 1,
              opacity: 1
          }
        },
        xaxis: {
         categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
          },
          axisBorder: {
              show: false,
            },
        },
        yaxis: {
            show: false
        },
        tooltip: {
            x: {
                show: true
            }
        },
         responsive: [{
            breakpoint: 575,
            options: {
                chart: {
                    height: 180
                }
            }
         }]
    };
  }
  
  ngOnInit(): void {
  }

}
