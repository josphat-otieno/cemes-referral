import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }
  
  
  
  dashboardWidgets = [
        {
          title: "Number of Businesses",
          total_no: "0",
          icon_class: "flaticon-381-list",
          wrapper_class: "bg-danger",
        },
        {
          title: "Number of Members",
          total_no: "0",
          icon_class: "flaticon-381-user-9",
          wrapper_class: "bg-success",
        },
        {
          title: "Join Requests",
          total_no: "0",
          icon_class: "flaticon-381-add-3",
          wrapper_class: "bg-info",
        },
        {
          title: "Revenue",
          total_no: "Ksh.0.00",
          icon_class: "flaticon-381-diamond",
          wrapper_class: "bg-primary",
        },
  ];
  
    patientActivity = [
        {
          image: "assets/images/avatar/1.jpg",
          patient_detail: "Media heading",
          age: "41 Years Old",
          disease: "Allergies & Asthma",
          status: "Recovered",
          date: "22/03/2020 12:34 AM",
          active_class: "",
          url: "admin/patient-details",
          status_class: "text-success",
        },
        {
          image: "assets/images/avatar/2.jpg",
          patient_detail: "Angela Nurhayati",
          age: "21 Years Old",
          disease: "Sleep Problem",
          status: "New Patient",
          date: "22/03/2020 12:34 AM",
          active_class: "",
          url: "admin/patient-details",
          status_class: "text-danger",
        },
        {
          image: "assets/images/avatar/3.jpg",
          patient_detail: "James Robinson",
          age: "25 Years Old",
          disease: "Dental Care",
          status: "In Treatment",
          date: "22/03/2020 12:34 AM",
          active_class: "active",
          url: "admin/patient-details",
          status_class: "text-warning",
        },
        {
          image: "assets/images/avatar/4.jpg",
          patient_detail: "Thomas Jaja",
          age: "7 Years Old",
          disease: "Diabetes",
          status: "New Patient",
          date: "22/03/2020 12:34 AM",
          active_class: "",
          url: "admin/patient-details",
          status_class: "text-danger",
        },
        {
          image: "assets/images/avatar/5.jpg",
          patient_detail: "Cindy Brownleee",
          age: "71 Years Old",
          disease: "Covid-19 Suspect",
          status: "Recovered",
          date: "22/03/2020 12:34 AM",
          active_class: "",
          url: "admin/patient-details",
          status_class: "text-success",
        },
        {
          image: "assets/images/avatar/6.jpg",
          patient_detail: "Oconner Jr.",
          age: "17 Years Old",
          disease: "Dental Care",
          status: "In Treatment",
          date: "22/03/2020 12:34 AM",
          active_class: "",
          url: "admin/patient-details",
          status_class: "text-warning",
        },
    ];
    
    
    bestBusinesses = this.sharedService.bestBusinesses;
    
    /* bestBusinesses = [
        {
          image: "assets/images/avatar/1.jpg",
          number: "#1",
          name: "Dr. Samantha Queque",
          specialist: "Gynecologist",
          total_reviews: "451 reviews",
          url: "admin/doctors-details",
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
          social_link: [
            {
              title:"facebook",
              icon_class:"fa fa-instagram",
              link:"https://www.instagram.com/dexignzones",
            },
            {
              title:"twitter",
              icon_class:"fa fa-twitter",
              link:"https://twitter.com/dexignzones",
            },
            {
              title:"linkedin",
              icon_class:"fa fa-facebook",
              link:"https://www.linkedin.com/showcase/dexignzone",
            },
          ]
        },
        {
          image: "assets/images/avatar/2.jpg",
          number: "#2",
          name: "Dr. Abdul Aziz Lazis",
          specialist: "Physical Therapy",
          total_reviews: "238 reviews",
          url: "admin/doctors-details",
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
          social_link: [
            {
              title:"facebook",
              icon_class:"fa fa-instagram",
              link:"https://www.instagram.com/dexignzones",
            },
            {
              title:"twitter",
              icon_class:"fa fa-twitter",
              link:"https://twitter.com/dexignzones",
            },
            {
              title:"linkedin",
              icon_class:"fa fa-facebook",
              link:"https://www.linkedin.com/showcase/dexignzone",
            },
          ]
        },
        {
          image: "assets/images/avatar/3.jpg",
          number: "#3",
          name: "Dr. Samuel Jr.",
          specialist: "Dentist",
          total_reviews: "300 reviews",
          url: "admin/doctors-details",
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
          social_link: [
            {
              title:"facebook",
              icon_class:"fa fa-instagram",
              link:"https://www.instagram.com/dexignzones",
            },
            {
              title:"twitter",
              icon_class:"fa fa-twitter",
              link:"https://twitter.com/dexignzones",
            },
            {
              title:"linkedin",
              icon_class:"fa fa-facebook",
              link:"https://www.linkedin.com/showcase/dexignzone",
            },
          ]
        },
        {
          image: "assets/images/avatar/4.jpg",
          number: "#4",
          name: "Dr. Alex Siauw",
          specialist: "Physical Therapy",
          total_reviews: "451 reviews",
          url: "admin/doctors-details",
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
          social_link: [
            {
              title:"facebook",
              icon_class:"fa fa-instagram",
              link:"https://www.instagram.com/dexignzones",
            },
            {
              title:"twitter",
              icon_class:"fa fa-twitter",
              link:"https://twitter.com/dexignzones",
            },
            {
              title:"linkedin",
              icon_class:"fa fa-facebook",
              link:"https://www.linkedin.com/showcase/dexignzone",
            },
          ]
        },
        {
          image: "assets/images/avatar/5.jpg",
          number: "#5",
          name: "Dr. Jennifer Ruby",
          specialist: "Nursingc",
          total_reviews: "700 reviews",
          url: "admin/doctors-details",
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
              icon_class:"fa fa-star text-orange",
            },
          ],
          social_link: [
            {
              title:"facebook",
              icon_class:"fa fa-instagram",
              link:"https://www.instagram.com/dexignzones",
            },
            {
              title:"twitter",
              icon_class:"fa fa-twitter",
              link:"https://twitter.com/dexignzones",
            },
            {
              title:"linkedin",
              icon_class:"fa fa-facebook",
              link:"https://www.linkedin.com/showcase/dexignzone",
            },
          ]
        },
    ]; */

}
