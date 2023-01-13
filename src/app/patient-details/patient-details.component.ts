import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  assignDoctors = [
        {
          image: "assets/images/avatar/1.jpg",
          name: "Dr. Inggrid A.",
          specialist: "Dentist",
          total_reviews: "451 reviews",
          url: "admin/doctors-details",
          ratings: "4.5",
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
              icon_class:"fa fa-star text-gray",
            },
            {
              icon_class:"fa fa-star text-gray",
            },
          ],
        },
        {
          image: "assets/images/avatar/3.jpg",
          name: "Dr. Widan Cheeh",
          specialist: "Respiratory Specialist",
          total_reviews: "451 reviews",
          url: "admin/doctors-details",
          ratings: "4.5",
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
              icon_class:"fa fa-star text-gray",
            },
            {
              icon_class:"fa fa-star text-gray",
            },
          ],
        },
        {
          image: "assets/images/avatar/3.jpg",
          name: "Dr. Samantha",
          specialist: "Gynecologist",
          total_reviews: "451 reviews",
          url: "admin/doctors-details",
          ratings: "4.5",
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
              icon_class:"fa fa-star text-gray",
            },
            {
              icon_class:"fa fa-star text-gray",
            },
          ],
        },
        {
          image: "assets/images/avatar/2.jpg",
          name: "Dr. Widan Cheeh",
          specialist: "Respiratory Specialist",
          total_reviews: "451 reviews",
          url: "admin/doctors-details",
          ratings: "4.5",
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
              icon_class:"fa fa-star text-gray",
            },
            {
              icon_class:"fa fa-star text-gray",
            },
          ],
        },
        {
          image: "assets/images/avatar/3.jpg",
          name: "Dr. Samantha",
          specialist: "Gynecologist",
          total_reviews: "451 reviews",
          url: "admin/doctors-details",
          ratings: "4.5",
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
              icon_class:"fa fa-star text-gray",
            },
            {
              icon_class:"fa fa-star text-gray",
            },
          ],
        },
    ];

}
