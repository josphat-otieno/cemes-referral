import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
    
    public currentHref: string = "";


  constructor(location: Location, router: Router, private cbfService:CbfService) {
    router.events.subscribe((val) => {
      if(location.path() != ''){
        this.currentHref = location.path();
      } else {
        this.currentHref = 'Home'
      }
    });
  }


  ngOnInit(): void {
  }
  
  toggleIcon: boolean = true;
  
  toggleLoveIcon() {
      this.toggleIcon = !this.toggleIcon;
  }
  
  systemParameterArray = [
    '/admin/assembly',
    '/admin/account-packages',
    '/admin/business-category',
    '/admin/business-sub-category',
    // '/admin/forum-category',
    '/admin/forum',
    '/admin/forum-management',
    '/admin/profanity-report'
  ]
    
  businessArray = [
    '/admin/business-list',
    '/admin/business-products',
    '/admin/advertisement',
    // '/admin/awareness',
    '/admin/business-rating'
  ]

  membershipArray = [
    '/admin/member-database',
    '/admin/app-users',
    '/admin/payments',
    '/admin/member-complaints',
	];

  staffArray = [
    '/admin/users'
  ];

  eventsArray = [
    '/admin/events-management',
    '/admin/event-program-management',
    '/admin/event-custom-forms',
    '/admin/custom-form-items',
    '/admin/events-custom-form-feedbacks',
  ];
    
  formsArray = [
    '/admin/form-element',
    '/admin/form-validate',
	];

  logoutUserAction() {
    // this.loade

    setTimeout(() => {      
    this.cbfService.logoutUser()
    }, 2000);
  }

}
