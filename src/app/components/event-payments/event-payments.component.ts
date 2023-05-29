import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-event-payments',
  templateUrl: './event-payments.component.html',
  styleUrls: ['./event-payments.component.css']
})
export class EventPaymentsComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public payment_list:any = []
  public paid_events_count:number = 0
  public active_events_count:number = 0
  public payment_count:number = 0

  public messageResponse:string = ''
  public msg:string = ''
  
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
    this.getPayments()
  }
     
  // Endpoints Consumption  
  getPayments(){

    let event_id = 0

    const paymentSubscr = this.cbfService.getEventPayments(event_id, this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.payment_count = result.total_payments
        this.paid_events_count = result.paid_events 
        this.active_events_count = result.active_events 
        this.payment_list = result.results 

        if(this.payment_count > 0){
          this.dtTrigger.next(this.payment_list)
        }        
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(paymentSubscr);

  }


}
