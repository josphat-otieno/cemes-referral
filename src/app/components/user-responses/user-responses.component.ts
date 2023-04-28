import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LightboxConfig, Lightbox } from 'ngx-lightbox';
import { Subscription, Subject } from 'rxjs';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-user-responses',
  templateUrl: './user-responses.component.html',
  styleUrls: ['./user-responses.component.css']
})
export class UserResponsesComponent implements OnInit {
  public user_id:number = 0

  public accessToken:string = ''  
  private unsubscribe: Subscription[] = [];
  private msg:string = '' 
    // Datatables
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject<any>();

    formItemData: any = []
  customFormId: any
  responses: any = [];
  customFormResponses: any = []
  userDetails: any = []
  customFormDetails: any = []
  customFormModalData: any
  items: any = []
  customFormName: string = ''

  userResponses: any = []
  tableHeaders : any = []
  userID: any;
   
  constructor(
    private fb: FormBuilder,  
    private router: Router,  
    private toaster: ToastService,
    private modalService: NgbModal,
    private cbfService: CbfService,

    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      const uid = params['gidb64'];

      this.customFormId = uid;
    });

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
      this.accessToken =  this.cbfService.AccessToken
      this.user_id = Number(this.cbfService.currentUserValue)
      this.getUsersResponses()
  }

  openModal(targetModal:any, form:any) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    let modal_data = form;
    this.userID = modal_data.id
    // console.log(this.customFormId)
    this.customFormModalData = modal_data;

    this.userResponses =  this.customFormModalData.original_response


  }

  getUsersResponses(){
    const responses = this.cbfService.getEventsCustomFormFeedbackList(this.customFormId, this.accessToken)
    .subscribe({
      next:(response: any)=>{
        let usersData: any = []
        let usersDataArray: any = []
        usersData = response
        usersData.forEach( (user:any) => {
          let id = user['id']
          let full_name = user['full_name']
          let response: any = []
          let responses = user['response']
          if (responses.length > 4) {
            response = responses.slice(0, 3)
          } else if (responses.length <= 4) {
            response = responses
          }
          let user_object = { 'id': id, 'full_name': full_name,  'response': response, 'original_response':responses }
          usersDataArray.push(user_object)

        })
        this.customFormResponses = usersDataArray
        this.tableHeaders  = this.customFormResponses[0]['response']


        if(this.customFormResponses.length > 0){
          this.dtTrigger.next(this.customFormResponses)
        }        
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })
  }

}


