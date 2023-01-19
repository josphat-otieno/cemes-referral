import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit {

  public accessToken:string = ''  
  public user_id:number = 0

  public BusinessRegistration: FormGroup | any;
  public assemblies:any = []
  private unsubscribe: Subscription[] = [];
  private msg:string = ''  
  public password:string =''
  public passwordValue:string =''

  // response
  public messageResponse:string = ''

  // parameters
  public adsList:any = []
  public pendingadsList:any = []
  public pendingAdsCount:number = 0
  public activeAdsCount:number = 0
  public AdsCount:number = 0
  public businessModalData:any = []

  // business Def Parameters
  public businessOwnerId:number = 0
  public businessCategory:number = 0
  public assemblyId:number = 0

  // validation parameters
  public validity:boolean = false
  public phoneValidationMessage:boolean = false
  public emailValidationMessage:boolean = false

  // public business 
  public currentRate:number = 0

  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  ptOptions: any = {};
  ptTrigger: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,    
    private toaster: ToastService,
    private modalService: NgbModal,
    private cbfService: CbfService
  ) {
    this.createForm();
  }
  
  createForm() {
    this.BusinessRegistration = this.fb.group({
      fullName: ['', [Validators.required ]],
      email: ['', [Validators.required ,  Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(6)] ],
		  assembly: ['', [Validators.required] ],
      phoneNumber: ['', [Validators.required] ],
    })
  }
  

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
    this.ptOptions = {
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

    this.pendingAdsCount = 1
    this.activeAdsCount = 1
    this.AdsCount = 1
    
    this.accessToken =  this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)
   
  }
  
  // modal mgt
  openModal(content:any, size:string) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

	}
  
  featureComing() {
    this.messageResponse = 'Feature coming soon, please bare with us. Thank you.'
  }
  
}

