import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recent-review',
  templateUrl: './recent-review.component.html',
  styleUrls: ['./recent-review.component.css']
})
export class RecentReviewComponent implements OnInit {

  @Input() data:any;

  constructor() { }

  ngOnInit(): void {
  }

}
