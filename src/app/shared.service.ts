import { Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  navSidebarClass: boolean = true;
  hamburgerClass: boolean = false;

  constructor() { }
  
  toggleSidebarClass() {
	return this.navSidebarClass = !this.navSidebarClass  ;
  }
  toggleHamburgerClass() {
	return this.hamburgerClass = !this.hamburgerClass  ;
  }
 
  // bestDoctor: [];
  // doc: [];
  
  
  bestDoctor = [
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
    ];
    
    
    add_doc() {
        // const totalLength = this.bestDoctor.length + 1;
        const rndInt = Math.floor(Math.random() * 5)/*  + 1 */ ;
        console.log(rndInt);
        const doc = this.bestDoctor[rndInt];
        this.bestDoctor.push(doc);
        return true;
    }
  
}
