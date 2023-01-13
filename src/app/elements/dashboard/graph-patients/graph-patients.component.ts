import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexResponsive,
  ApexFill,
  ApexLegend,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  labels: string[] | any;
  plotOptions: ApexPlotOptions | any;
  responsive: ApexResponsive[] | any;
  fill: ApexFill | any;
  colors: string[] | any;
  legend: ApexLegend | any;
};

@Component({
  selector: 'app-graph-patients',
  templateUrl: './graph-patients.component.html',
  styleUrls: ['./graph-patients.component.css']
})
export class GraphPatientsComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [71, 63, 90],
        chart: {
            type: 'radialBar',
            //width:320,
            height: 350,
            offsetY: 0,
            offsetX: 0,
            
        },
        plotOptions: {
			radialBar: {
			  // size: undefined,
			  inverseOrder: false,
			  hollow: {
				margin: 0,
				size: '35%',
				background: 'transparent',
			  },
			  
			  
			  
			  track: {
				show: true,
				background: '#e1e5ff',
				strokeWidth: '10%',
				opacity: 1,
				margin: 15, // margin is in pixels
			  },


			},
        },
        responsive: [{
          breakpoint: 480,
          options: {
			chart: {
			offsetY: 0,
			offsetX: 0
		  },	
            legend: {
              position: 'bottom',
              offsetX:0,
              offsetY: 0
            }
          }
        }],
		fill: {
          opacity: 1
        },
        colors:['#ff2c53', '#209f84', '#ff5c00'],
        labels: ['New', 'Recover', 'In Treatment'],
        legend: {
			fontSize: '16px',  
			show: false,
        },
    };
  }

  ngOnInit(): void {
  }

}
