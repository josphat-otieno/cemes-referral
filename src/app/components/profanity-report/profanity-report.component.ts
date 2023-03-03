import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-profanity-report',
  templateUrl: './profanity-report.component.html',
  styleUrls: ['./profanity-report.component.css']
})
export class ProfanityReportComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public profanityCount:number = 0
  public profanityList:any = []
  
  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private cbfService: CbfService
  ) {  }
  

  ngOnInit(): void {

     // datatable
     this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      buttons: [
        'copy',
        'print',
        'csv',
        'excel',
        'pdf'
      ]
    };    

    this.accessToken = this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)
    this.getProfanityList()
  }
   
  // Endpoints Consumption  
  getProfanityList(){

    const profanitySubscr = this.cbfService.getProfanityListing(this.accessToken)
    // .map(region_name)
    .subscribe({
      next: (response: any) => {
        let result = response 

        this.profanityCount = result.count  
        this.profanityList = result.results 

        if(this.profanityCount > 0){        
          this.dtTrigger.next(this.profanityList)
        }
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(profanitySubscr);

  }

}
