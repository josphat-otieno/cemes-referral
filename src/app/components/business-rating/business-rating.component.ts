import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-business-rating',
  templateUrl: './business-rating.component.html',
  styleUrls: ['./business-rating.component.css']
})
export class BusinessRatingComponent implements OnInit {

  public accessToken:string = ''  
  public user_id:number = 0

  public assemblies:any = []
  private unsubscribe: Subscription[] = [];
  public password:string =''
  public passwordValue:string =''

  // response
  public messageResponse:string = ''

  // parameters
  public ratingList:any = []
  public businessModalData:any = []
  public verifiedRatingCount:number = 0
  public pendingRatingsList:any = []
  public pendingRatingsCount:number = 0
  public activeAdsCount:number = 0
  public allRatingsCount:number = 0
  public reviewCount:number = 0

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

  public rating1: any = 0
  public rating2: any = 0

  constructor(
    private fb: FormBuilder,    
    private toaster: ToastService,
    private modalService: NgbModal,
    private cbfService: CbfService
  ) {  }
   
  ngOnInit(): void {

    this.rating1 = 3.5
    this.rating2 = 4.5

    // datatable

    this.pendingRatingsCount = 1
    this.activeAdsCount = 1
    this.reviewCount = 2
    
    this.accessToken =  this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)
   
    this.getVerifiedRatings()
    this.getPendingRatings()
  }
  
  // modal mgt
  openModal(content:any, size:string) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

	}

  // -------------------------------------------------------------------- Endpoints Consumption
 
  // Verified Ratings
  getVerifiedRatings() {
    let status = true
    const ratverSubscr = this.cbfService.getBusinessRatings(status, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.allRatingsCount = queryResults.count.all
        this.verifiedRatingCount = queryResults.count.total
        this.reviewCount = queryResults.count.reviews
        this.ratingList = queryResults.results    
      },
      error: (e:HttpErrorResponse) =>  console.log('Something went wrong, please try again')   
    })
    
    this.unsubscribe.push(ratverSubscr);
  }

  // Pending Ratings
  getPendingRatings() {
    let status = false
    const ratpenSubscr = this.cbfService.getBusinessRatings(status, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.pendingRatingsCount = queryResults.count.total
        this.pendingRatingsList = queryResults.results     
      },
      error: (e:HttpErrorResponse) =>  console.log('Something went wrong, please try again')   
    })
    
    this.unsubscribe.push(ratpenSubscr);
  }
  
  featureComing() {
    this.messageResponse = 'Feature coming soon, please bare with us. Thank you.'
  }
  
}

