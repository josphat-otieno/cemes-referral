import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
    
    public currentHref: string = "";


  constructor(location: Location, router: Router) {
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
    '/admin/forum-category',
    '/admin/forum',
  ]
    
  businessArray = [
    '/admin/business-list',
    '/admin/advertisement',
    '/admin/awareness',
  ]

  membershipArray = [
    '/admin/uc-nestable',
    '/admin/uc-lightgallery',
	];

  staffArray = [
    '/admin/users'
  ];
    
  formsArray = [
    '/admin/form-element',
    '/admin/form-validate',
	];

}
