import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-member-complaints',
  templateUrl: './member-complaints.component.html',
  styleUrls: ['./member-complaints.component.css']
})
export class MemberComplaintsComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public complaintCount:number = 0
  public complaintList:any = []
  
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
    this.getcomplaintList()
  }
   
  // Endpoints Consumption  
  getcomplaintList(){

    let filter = 'all'

    const memberSubscr = this.cbfService.getMemberComplaints(filter, this.accessToken)
    // .map(region_name)
    .subscribe({
      next: (response: any) => {
        let result = response 

        this.complaintCount = result.count  
        this.complaintList = result.results 

        if(this.complaintCount > 0){        
          this.dtTrigger.next(this.complaintList)
        }
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(memberSubscr);

  }

}
