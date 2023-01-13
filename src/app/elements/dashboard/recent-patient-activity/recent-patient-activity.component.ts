import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recent-patient-activity',
  templateUrl: './recent-patient-activity.component.html',
  styleUrls: ['./recent-patient-activity.component.css']
})
export class RecentPatientActivityComponent implements OnInit {

  @Input() data:any;

  constructor() { }

  ngOnInit(): void {
  }

}
