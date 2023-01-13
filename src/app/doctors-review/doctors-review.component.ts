import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctors-review',
  templateUrl: './doctors-review.component.html',
  styleUrls: ['./doctors-review.component.css']
})
export class DoctorsReviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  
  allReview = [
        {
          image: "assets/images/avatar/1.jpg",
          name: "Glee Smiley",
          description: "When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling",
          date: "Sunday, 24 July 2020   04:55 PM",
          disease: "Diabetes",
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
          name: "Alexa Keev",
          description: "When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling",
          date: "Sunday, 24 July 2020   04:55 PM",
          disease: "Dental Care",
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
          name: "Ivankov",
          description: "When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling",
          date: "Sunday, 24 July 2020   04:55 PM",
          disease: "Cold & Flu",
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
          image: "assets/images/avatar/4.jpg",
          name: "Axestoria Jr.",
          description: "When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling",
          date: "Sunday, 24 July 2020   04:55 PM",
          disease: "Diabetes",
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
    
    
    publishedReview = [
        {
          image: "assets/images/avatar/1.jpg",
          name: "Glee Smiley",
          description: "When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling",
          date: "Sunday, 24 July 2020   04:55 PM",
          disease: "Diabetes",
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
          name: "Alexa Keev",
          description: "When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling",
          date: "Sunday, 24 July 2020   04:55 PM",
          disease: "Dental Care",
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
    
    deletedReview = [
        {
          image: "assets/images/avatar/2.jpg",
          name: "Alexa Keev",
          description: "When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling",
          date: "Sunday, 24 July 2020   04:55 PM",
          disease: "Dental Care",
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
          name: "Ivankov",
          description: "When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling",
          date: "Sunday, 24 July 2020   04:55 PM",
          disease: "Cold & Flu",
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
          image: "assets/images/avatar/4.jpg",
          name: "Axestoria Jr.",
          description: "When I came with my mother, I was very nervous. But after entering here I felt warmed with smiling",
          date: "Sunday, 24 July 2020   04:55 PM",
          disease: "Diabetes",
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
