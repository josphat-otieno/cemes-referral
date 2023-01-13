import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-doctors-details',
  templateUrl: './doctors-details.component.html',
  styleUrls: ['./doctors-details.component.css']
})
export class DoctorsDetailsComponent implements OnInit {

  model!: NgbDateStruct;
  date!: {year: number, month: number};
  
  constructor(private modalService: NgbModal, private calendar: NgbCalendar) {}

 


  ngOnInit(): void {
  }
  
    open(content:any) {
		this.modalService.open(content);
	}
    
    recentReview = [
        {
          image: "assets/images/avatar/1.jpg",
          name: "Glee Smiley",
          description: "Hospital & staff were extremely warm & quick in getting me start with the procedures.",
          total_reviews: "451 reviews",
          url: "admin/doctors-review",
          ratings: "4.5",
          tags: [
            {
              name:"EXCELENT",
            },
            {
              icon_class:"GREAT SERVICE",
            },
          ],
		  ratings_class: [
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-gray",
            },
          ],
        },
        {
          image: "assets/images/avatar/2.jpg",
          name: "Emilian Brownlee",
          description: "Hospital & staff were extremely warm & quick in getting me start with the procedures.",
          total_reviews: "451 reviews",
          url: "admin/doctors-review",
          ratings: "4.5",
          tags: [
            {
              name:"EXCELENT",
            },
            {
              icon_class:"GREAT SERVICE",
            },
          ],
		  ratings_class: [
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-gray",
            },
          ],
        },
        {
          image: "assets/images/avatar/3.jpg",
          name: "Stevani Anderson",
          description: "Hospital & staff were extremely warm & quick in getting me start with the procedures.",
          total_reviews: "451 reviews",
          url: "admin/doctors-review",
          ratings: "4.5",
          tags: [
            {
              name:"EXCELENT",
            },
            {
              icon_class:"GREAT SERVICE",
            },
          ],
		  ratings_class: [
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-orange",
            },
            {
              icon_class:"fa fa-star text-gray",
            },
          ],
        },
    ];

}
