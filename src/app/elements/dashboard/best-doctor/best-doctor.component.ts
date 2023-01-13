import { Component, OnInit, Input } from '@angular/core';
import {SharedService} from '../../../shared.service';
@Component({
  selector: 'app-best-doctor',
  templateUrl: './best-doctor.component.html',
  styleUrls: ['./best-doctor.component.css']
})
export class BestDoctorComponent implements OnInit {

  @Input() data:any;
  
  toggleLoadMore: boolean = false;
  responseDoc: boolean = false;
  
  
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }
  
  
    add_doc() {
        this.toggleLoadMore = true;
        this.responseDoc = this.sharedService.add_doc();

        setTimeout(() => this.toggleLoadMore = false, 1000);

        // if(this.responseDoc) {
        // }
    }
    

    
    

}
