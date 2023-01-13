import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,  
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  fill: ApexFill | any;
  legend: ApexLegend | any;
  dataLabels: ApexDataLabels | any;
  colors: string[] | any;
  stroke: ApexStroke | any;
  tooltip: ApexTooltip | any;
};


@Component({
  selector: 'app-graph-patient-statistic',
  templateUrl: './graph-patient-statistic.component.html',
  styleUrls: ['./graph-patient-statistic.component.css']
})
export class GraphPatientStatisticComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [35, 45, 20],
      chart: {
        width: 180,
        height: 180,
        type: "donut"
      },
      dataLabels: {
        enabled: false
      },
        stroke: {
          width: 0,
        },
      fill: {
        type: "solid"
      },
      legend: {
        position: "bottom",
        show:false
      },
      tooltip: {
        enabled: false,
      },
       labels: ["Heart Beat", "Immunities", "Weigth"],
      colors:['#209f84', '#2781d5', '#ff2c53'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 150
            },
            legend: {
              position: "bottom",
			  show:false
            }
          }
        }
      ]
    };
  }

  ngOnInit(): void {
  }

}
