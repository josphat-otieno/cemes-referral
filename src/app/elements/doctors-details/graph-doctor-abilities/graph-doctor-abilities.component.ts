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
};

@Component({
  selector: 'app-graph-doctor-abilities',
  templateUrl: './graph-doctor-abilities.component.html',
  styleUrls: ['./graph-doctor-abilities.component.css']
})
export class GraphDoctorAbilitiesComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [35, 45, 20],
      chart: {
        width: 300,
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
       labels: ["Operation", "Theraphy", "Mediation"],
      colors:['#07654e', '#209f84', '#93cbff'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
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
