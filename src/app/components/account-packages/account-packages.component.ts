import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-account-packages',
  templateUrl: './account-packages.component.html',
  styleUrls: ['./account-packages.component.css']
})
export class AccountPackagesComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public packageList:any = []
  public packageCount:number = 0

  public packageModalData:any = []
  public messageResponse:string = ''
  public msg:string = ''

  public validity:boolean = false
  public packageRegistration: FormGroup | any
  
  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private cbfService: CbfService,
    private modalService: NgbModal,
    private fb: FormBuilder
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
    this.createForm()
    this.getPackageList()
  }

  createForm() {
    this.packageRegistration = this.fb.group({
      packageName: ['', [Validators.required ]],
      amount: [0, [Validators.required]],
      businessLimit: [1, [Validators.required, Validators.minLength(1)] ],
    })
  }

  
  // modals
  openModal(content:any, size:string) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

	}

  reviewModal(content:any, data:any) {
    this.modalService.open(content)
    this.packageModalData = data
  }
   
  // Endpoints Consumption  
  getPackageList(){

    const pkgSubscr = this.cbfService.getAccountPackages(this.accessToken)
    // .map(region_name)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.packageCount = result.count
        this.packageList = result.results 

        if(this.packageCount > 0){
          this.dtTrigger.next(this.packageList)
        }        
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(pkgSubscr);

  }

  savePackage() {

    const regData:FormData = new FormData()
    regData.append('name', this.packageRegistration.get('packageName')?.value)
    regData.append('amount', this.packageRegistration.get('amount')?.value)
    regData.append('business_limit', this.packageRegistration.get('businessLimit')?.value)
    regData.append('modified_by', this.user_id.toString())

    const regsterSubscr = this.cbfService.registerPackage(regData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let results = response
        
        if(results.id){
          
          this.messageResponse = 'Package created successfully'
            
          setTimeout(() => {
            window.location.reload()
          }, 1200);

        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.msg = 'Something went wrong, please try again'  
        this.messageResponse = this.msg
      }   
    })
    
    this.unsubscribe.push(regsterSubscr);
  }

  updatePackageAction(data: any) {

    let modalData = data
    let packageId = modalData.id

    const updateData:FormData = new FormData()
    updateData.append('name', modalData.name)
    updateData.append('amount', modalData.amount)
    updateData.append('business_limit', modalData.business_limit)
    updateData.append('modified_by', this.user_id.toString())

    const updateSubscr = this.cbfService.updatePackage(updateData, packageId,  this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Package updated successfully'
            
          setTimeout(() => {
            window.location.reload()
          }, 1200);

        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.messageResponse = 'Something went wrong, please try again'  
      }   
    })
    
    this.unsubscribe.push(updateSubscr);

  }

  deletePackageAction(data: any) {

    let modalData = data
    let packageId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_deleted', true.toString())
    delData.append('modified_by', this.user_id.toString())

    const delSubscr = this.cbfService.updatePackage(delData, packageId, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Package deleted successfully'
            
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

}
