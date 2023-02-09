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

  private unsubscribe: Subscription[] = [];

  // response
  public messageResponse:string = ''

  // parameters
  public advertList:any = []
  public advertModalData:any = []
  public verifiedAdCount:number = 0
  public pendingAdsList:any = []
  public pendingAdsCount:number = 0
  public rejectedAdvertsList:any = []
  public rejectedAdvertsCount:number = 0
  public allAdsCount:number = 0
  public paidAdvertsCount:number = 0

  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  ptOptions: any = {};
  ptTrigger: Subject<any> = new Subject<any>();

  rtOptions: any = {};
  rtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,    
    private toaster: ToastService,
    private modalService: NgbModal,
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

    this.rtOptions = {
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
   
    this.getVerifiedAds()
    this.getPendingAds()
    this.getRejectedAds()

  }
  
  // modal mgt
  openModal(content:any, size:string, type:string, data:any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

    this.advertModalData = data

	}

  reviewModal(content:any, data:any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
    });

    // data
    this.advertModalData = data

	}

  // -------------------------------------------------------------------- Endpoints Consumption
 
  // Verified Advertisements
  getVerifiedAds() {
    let status = true
    const verAdSubscr = this.cbfService.getAdvertisements(status, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.allAdsCount = queryResults.count.all
        this.verifiedAdCount = queryResults.count.total
        this.paidAdvertsCount = queryResults.count.paid
        this.advertList = queryResults.results  

        if(this.verifiedAdCount > 0){
          this.dtTrigger.next(this.advertList)
        }

      },
      error: (e:HttpErrorResponse) =>  console.log('Something went wrong, please try again')   
    })
    
    this.unsubscribe.push(verAdSubscr);
  }

  // Pending Advertisements
  getPendingAds() {
    let status = false
    const pendingSubscr = this.cbfService.getAdvertisements(status, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.pendingAdsCount = queryResults.count.total
        this.pendingAdsList = queryResults.results 

        if(this.pendingAdsCount > 0){
          this.ptTrigger.next(this.pendingAdsList)
        }
        
      },
      error: (e:HttpErrorResponse) =>  console.log('Something went wrong, please try again')   
    })
    
    this.unsubscribe.push(pendingSubscr);
  }

  // Get Rejected
  getRejectedAds() {
    const rejAdSubscr = this.cbfService.getRejectedAdvertisements(this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.rejectedAdvertsCount = queryResults.count
        this.rejectedAdvertsList = queryResults.results 

        if(this.rejectedAdvertsCount > 0){
          this.rtTrigger.next(this.rejectedAdvertsList)
        }
        
      },
      error: (e:HttpErrorResponse) =>  console.log('Something went wrong, please try again')   
    })
    
    this.unsubscribe.push(rejAdSubscr);
  }

  deleteAdvert(data: any) {

    let modalData = data
    let advertId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_active', false.toString())
    delData.append('is_deleted', true.toString())
    delData.append('modified_by', this.user_id.toString())

    const delSubscr = this.cbfService.updateAdvertisement(advertId, delData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          this.messageResponse = 'Advertisement successfully deleted'

          setTimeout(() => {
            window.location.reload()
          }, 1200);
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
      }   
    })
    
    this.unsubscribe.push(delSubscr);

  }

  verifyAdvert(data: any) {

    let modalData = data
    let advertId = modalData.id

    const advertData:FormData = new FormData()
    advertData.append('is_active', true.toString())
    advertData.append('is_verified', true.toString())
    advertData.append('review_status', 'verified')
    advertData.append('verified_by', this.user_id.toString())

    const verSubscr = this.cbfService.updateAdvertisement(advertId, advertData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          this.messageResponse = 'Advertisement successfully verified'

          setTimeout(() => {
            window.location.reload()
          }, 1200);
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
      }   
    })
    
    this.unsubscribe.push(verSubscr);

  }

  rejectAdvert(data: any) {

    let modalData = data
    let ad_Id = modalData.id

    const adData:FormData = new FormData()
    adData.append('review_status', 'rejected')
    adData.append('reason', modalData.reason)
    adData.append('verified_by', this.user_id.toString())

    const rejSubscr = this.cbfService.updateAdvertisement(ad_Id, adData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          this.messageResponse = 'Advertisement successfully rejected'

          setTimeout(() => {
            window.location.reload()
          }, 1200);
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
      }   
    })
    
    this.unsubscribe.push(rejSubscr);

  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe()
    this.ptTrigger.unsubscribe()
    this.rtTrigger.unsubscribe()
  }

}

