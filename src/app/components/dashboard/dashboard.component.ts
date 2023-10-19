import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // parameters
  public accessToken:string = ''
  public user_id:number  = 0
  public businessCount:number = 150
  public advertCount:number = 0
  public memberCount:number = 100
  public revenueFigure:number = 0
  public msg:string = ''
  public dashboardWidgets:any = []
  
  // business Def Parameters
  public businessOwnerId:number = 0
  public businessCategory:number = 0
  public assemblyId:number = 0
  
  private unsubscribe: Subscription[] = []; 

  constructor(
    private sharedService: SharedService,
    private cbfService: CbfService
  ) { }

  ngOnInit(): void {
    
    this.accessToken =  this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)

    this.getMetrics();
    this.listTopBusinesses()

  }
  
  getMetrics() {
    const metricsSubscr = this.cbfService.getDashboardMetrics(this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.businessCount = queryResults.businesses
        this.memberCount = queryResults.members
        this.advertCount = queryResults.adverts
        this.revenueFigure = queryResults.revenue       
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(metricsSubscr);


    // set timeout
    setTimeout(() => {
        this.dashboardWidgets = [
//          
// Number of leads

          {
            title: " Referrals this week",
            total_no: this.businessCount,
            icon_class: "flaticon-381-list",
            wrapper_class: "bg-danger",
          },
          {
            title: "Number of Leads",
            total_no: this.memberCount,
            icon_class: "flaticon-381-user-9",
            wrapper_class: "bg-success",
          },
          // {
          //   title: "Paid Advertisements",
          //   total_no: this.advertCount,
          //   icon_class: "flaticon-381-add-3",
          //   wrapper_class: "bg-info",
          // },
          // {
          //   title: "Revenue",
          //   total_no: "Ksh."+this.revenueFigure,
          //   icon_class: "flaticon-381-diamond",
          //   wrapper_class: "bg-primary",
          // },
    ];
    }, 1200);
  }

  listTopBusinesses() {
    const topBizSubscr = this.cbfService.getTopBusinesses(this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response

        let reviewedBusinessIds = queryResults.reviewed
        let topRated = queryResults.top_rated

        this.bestBusinesses = topRated
        
        console.log(queryResults)   
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(topBizSubscr);


    // set timeout
  }

  
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
