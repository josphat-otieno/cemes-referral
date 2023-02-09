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
  private unsubscribe: Subscription[] = [];

  // response
  public messageResponse:string = ''

  // parameters
  public ratingList:any = []
  public ratingModalData:any = []
  public verifiedRatingCount:number = 0
  public pendingRatingsList:any = []
  public pendingRatingsCount:number = 0
  public rejectedRatingsList:any = []
  public rejectedRatingsCount:number = 0
  public allRatingsCount:number = 0
  public reviewCount:number = 0

  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  ptOptions: any = {};
  ptTrigger: Subject<any> = new Subject<any>();

  rtOptions: any = {};
  rtTrigger: Subject<any> = new Subject<any>();

  public approvedRating: any = 0
  public pendingRating: any = 0

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
   
    this.getVerifiedRatings()
    this.getPendingRatings()
    this.getRejectedRatings()

  }
  
  // modal mgt
  openModal(content:any, size:string, type:string, data:any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

    this.ratingModalData = data

    if(type == 'verified'){
      this.approvedRating = this.ratingModalData?.rating
    } else if(type == 'pending'){
      // pending
      this.pendingRating = this.ratingModalData?.rating      
    } else if(type == 'rejected'){      
      this.approvedRating = this.ratingModalData?.rating
    }


	}

  reviewModal(content:any, data:any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
    });

    // data
    this.ratingModalData = data

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

        if(this.verifiedRatingCount > 0){
          this.dtTrigger.next(this.ratingList)
        }

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

        if(this.pendingRatingsCount > 0){
          this.ptTrigger.next(this.pendingRatingsList)
        }
        
      },
      error: (e:HttpErrorResponse) =>  console.log('Something went wrong, please try again')   
    })
    
    this.unsubscribe.push(ratpenSubscr);
  }

  // Get Rejected
  getRejectedRatings() {
    const rejRatSubscr = this.cbfService.getRejectedBusinessRatings(this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.rejectedRatingsCount = queryResults.count
        this.rejectedRatingsList = queryResults.results 

        if(this.rejectedRatingsCount > 0){
          this.rtTrigger.next(this.rejectedRatingsList)
        }
        
      },
      error: (e:HttpErrorResponse) =>  console.log('Something went wrong, please try again')   
    })
    
    this.unsubscribe.push(rejRatSubscr);
  }


  deleteRating(data: any) {

    let modalData = data
    let ratingId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_deleted', true.toString())
    delData.append('modified_by', this.user_id.toString())

    const delSubscr = this.cbfService.updateBusinessRating(ratingId, delData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          this.messageResponse = 'Rating successfully deleted'

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

  verifyRating(data: any) {

    let modalData = data
    let ratingId = modalData.id

    const ratingData:FormData = new FormData()
    ratingData.append('is_verified', true.toString())
    ratingData.append('review_status', 'verified')
    ratingData.append('verified_by', this.user_id.toString())

    const verSubscr = this.cbfService.updateBusinessRating(ratingId, ratingData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          this.messageResponse = 'Rating successfully verified'

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

  rejectRating(data: any) {

    let modalData = data
    let ratingId = modalData.id

    const ratingData:FormData = new FormData()
    ratingData.append('review_status', 'rejected')
    ratingData.append('reason', modalData.reason)
    ratingData.append('verified_by', this.user_id.toString())

    const rejSubscr = this.cbfService.updateBusinessRating(ratingId, ratingData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          this.messageResponse = 'Rating successfully rejected'

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
  
  featureComing() {
    this.messageResponse = 'Feature coming soon, please bare with us. Thank you.'
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe()
    this.ptTrigger.unsubscribe()
    this.rtTrigger.unsubscribe()
  }

}

