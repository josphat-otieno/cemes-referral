import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-custom-form-feedbacks',
  templateUrl: './custom-form-feedbacks.component.html',
  styleUrls: ['./custom-form-feedbacks.component.css']
})
export class CustomFormFeedbacksComponent implements OnInit {
  public accessToken: string = ''
  public user_id: number = 0
  private unsubscribe: Subscription[] = [];
  public msg: string = ''

  customFeedbacks:any
  forms_count:number =0

   // redirection
   public redirectUrl:string = ''

  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();


  constructor(
    private cbfService: CbfService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router
  ) { }

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

    this.getCustomFormFeedbacks()
  }


  redirectMe(formData: any) {

    let form_id = formData.id
    
    this.redirectUrl = '/admin/user-responses'
    this.router.navigate([this.redirectUrl], { queryParams: { gidb64: form_id }});
    
  }

  getCustomFormFeedbacks(){
    const feedSubscr = this.cbfService.getFeedbacks(this.accessToken)
    .subscribe({
      next: (response:any)=>{
          let data = response.results
          let count = response.count;
          this.forms_count = count
          this.customFeedbacks = data

        if(this.forms_count > 0){
          this.dtTrigger.next(this.customFeedbacks)
        }        
        

      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })
  }



}
