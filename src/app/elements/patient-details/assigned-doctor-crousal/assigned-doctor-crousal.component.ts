import { Component, OnInit, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-assigned-doctor-crousal',
  templateUrl: './assigned-doctor-crousal.component.html',
  styleUrls: ['./assigned-doctor-crousal.component.css']
})
export class AssignedDoctorCrousalComponent implements OnInit {

  @Input() data:any;
  constructor() { }

  ngOnInit(): void {
  }
  
  
  customOptions: OwlOptions = {
    loop:false,
    margin:30,
    nav:true,
    autoplaySpeed: 3000,
    navSpeed: 3000,
    // paginationSpeed: 3000,
    // slideSpeed: 3000,
    smartSpeed: 3000,
    autoplay: false,
    dots: false,
    navText: ['<i class="fa fa-caret-left"></i>', '<i class="fa fa-caret-right"></i>'],
    responsive:{
       
        0:{
            items:1
        },			
        
        550:{
            items:2
        },
        890:{
            items:3
        }
    }
  }

}
