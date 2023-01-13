import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
  }
  
    open(content:any) {
		this.modalService.open(content);
	}
    
    
    doctorsAcccordion = [
        {
          accordiontitle: "A",
          total_doctors: "5 Doctors",
          doctors_list: [
              {
                  image: "assets/images/avatar/1.jpg",
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
          ]
        },
        {
          accordiontitle: "B",
          total_doctors: "3 Doctors",
          doctors_list: [
              {
                  image: "assets/images/avatar/1.jpg",
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
          ]
        },
        {
          accordiontitle: "C",
          total_doctors: "2 Doctors",
          doctors_list: [
              {
                  image: "assets/images/avatar/1.jpg",
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
          ]
        },
    ];
    

}
