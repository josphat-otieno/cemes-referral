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
  
  
  bestBusinesses = [
        {
          image: "assets/images/avatar/1.jpg",
          number: "#1",
          name: "Dr. Gerald Consultation Clinic",
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
              link:"#",
            },
            {
              title:"twitter",
              icon_class:"fa fa-twitter",
              link:"#",
            },
            {
              title:"linkedin",
              icon_class:"fa fa-facebook",
              link:"#",
            },
          ]
        },
        {
          image: "assets/images/product/4.jpg",
          number: "#2",
          name: "Jane's Perfumes",
          specialist: "Smell good, feel great",
          total_reviews: "238 reviews",
          url: "#",
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
              link:"#",
            },
            {
              title:"twitter",
              icon_class:"fa fa-twitter",
              link:"#",
            },
            {
              title:"linkedin",
              icon_class:"fa fa-facebook",
              link:"#",
            },
          ]
        }
    ];
    
    
    add_doc() {
        // const totalLength = this.bestDoctor.length + 1;
        const rndInt = Math.floor(Math.random() * 5)/*  + 1 */ ;
        console.log(rndInt);
        const doc = this.bestBusinesses[rndInt];
        this.bestBusinesses.push(doc);
        return true;
    }
  
}
