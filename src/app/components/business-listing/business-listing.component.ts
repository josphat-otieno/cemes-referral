import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-business-listing',
  templateUrl: './business-listing.component.html',
  styleUrls: ['./business-listing.component.css']
})
export class BusinessListingComponent implements OnInit {

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
  public businesses:any = []
  public pendingBusinesses:any = []
  public pendingbusinessCount:number = 0
  public productsCount:number = 0
  public businessCount:number = 0
  public businessModalData:any = []

  // business Def Parameters
  public businessOwnerId:number = 0
  public businessCategory:number = 0
  public assemblyId:number = 0

  // validation parameters
  public validity:boolean = false
  public phoneValidationMessage:boolean = false
  public emailValidationMessage:boolean = false

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
    
    this.accessToken =  this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)
    this.getAssemblies()
    this.getProductCount()
    this.getBusinesses(this.assemblyId, this.businessOwnerId, this.businessCategory)
    this.getPendingbusinesses(this.assemblyId, this.businessOwnerId, this.businessCategory)

  }
  
  passwordInput(value:any){

    this.passwordValue = ''
    this.password =value
  }

  //Validate Phone Number
  validatePhone(value: string) {
    let phoneNumber = value;
    if((phoneNumber.length > 10) || (phoneNumber.length < 10) && (phoneNumber.charAt(0) != '0')){
      this.phoneValidationMessage = true;
      this.validity = true;
    } else {
      this.phoneValidationMessage = false;
      this.validity = false;
    }
  }

  //validate Email
  validateEmail(value: string) {
    let email = value;
    if(!email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")){
      this.emailValidationMessage = true;
      this.validity = true;
    } else {
      this.emailValidationMessage = false;
      this.validity = false;
    }
  }

  toggleEye: boolean = true;
  
  // toggle password
  toggleEyeIcon(inputPassword:any) {
		this.toggleEye = !this.toggleEye;		
		inputPassword.type = inputPassword.type === 'password' ? 'text' : 'password';
	}

  // modal mgt
  openModal(content:any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

	}

  generatePassword() {
    function getRandomString(length:any) {
      var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var result = '';
      for ( var i = 0; i < length; i++ ) {
          result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      return result;
    }
  
    this.passwordValue = getRandomString(8);
  }

  reviewModal(content:any, data:any) {
    this.modalService.open(content)
    this.businessModalData = data
  }

  reviewUpdateModal(editStaff:any, staff:any) {
    this.modalService.open(editStaff, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    this.password = ''
    let modalData = staff;
    this.businessModalData = modalData
  
  }
 
  // Endpoints Consumption
  getAssemblies() {
    const assemblySubscr = this.cbfService.getAssemblies(this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.assemblies = queryResults.results
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(assemblySubscr);
  }

  getProductCount() {
    const productSubscr = this.cbfService.getProducts(this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.productsCount = queryResults.count
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(productSubscr);
  }

  getBusinesses(assembly:number, businessOwner:number, category:number) {
    let verificationStatus = true
    const businessSubscr = this.cbfService.getVerifiedBusinesses(verificationStatus, assembly, businessOwner, category, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.businessCount = queryResults.count
        this.businesses = queryResults.results

        this.dtTrigger.next(this.businesses)
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(businessSubscr);

  }

  getPendingbusinesses(assembly:number, businessOwner:number, category:number) {
    let verificationStatus = false
    const businessSubscr = this.cbfService.getVerifiedBusinesses(verificationStatus, assembly, businessOwner, category, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.pendingbusinessCount = queryResults.count
        this.pendingBusinesses = queryResults.results

        if(queryResults.count > 0){
          this.ptTrigger.next(this.pendingBusinesses)
        }
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(businessSubscr);

  }

  saveMember() {

    const regData:FormData = new FormData()
    regData.append('full_name', this.BusinessRegistration.get('fullName')?.value)
    regData.append('email', this.BusinessRegistration.get('email')?.value)
    regData.append('phone_number', this.BusinessRegistration.get('phoneNumber')?.value)
    regData.append('password', this.BusinessRegistration.get('password')?.value)
    regData.append('assembly', this.BusinessRegistration.get('assembly')?.value)
    regData.append('user', this.user_id.toString())

    const regsterSubscr = this.cbfService.registerMember(regData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let results = response
        
        if(results.status){
          
          this.messageResponse = results.message

          if(results.status == 1){
            this.toaster.show(results.message, { classname: 'bg-success text-light', delay: 10000 });
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);

          } else {
            this.toaster.show(results.message, { classname: 'bg-warning text-light', delay: 10000 });
          }
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.msg = 'Something went wrong, please try again'  
        this.toaster.show(this.msg, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(regsterSubscr);
  }

  updateMember(data: any) {

    let modalData = data

    const updateData:FormData = new FormData()
    updateData.append('full_name', modalData.full_name)
    updateData.append('email', modalData.email)
    updateData.append('phone_number', modalData.phone_number)

    if(this.passwordValue != '' && modalData.password != ''){
      updateData.append('password', modalData.password)
    }

    updateData.append('assembly', modalData.assemblyUpdate)
    updateData.append('businessOwner', modalData.id)
    updateData.append('user', this.user_id.toString())

    const regsterSubscr = this.cbfService.updateMember(updateData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.status){
          
          this.messageResponse = response.message

          if(response.status == 1){

            this.toaster.show(response.message, { classname: 'bg-success text-light', delay: 10000 });
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);
          } else {
            this.toaster.show(response.message, { classname: 'bg-warning text-light', delay: 10000 });
          }
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.messageResponse = 'Something went wrong, please try again'  
        this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(regsterSubscr);

  }

  deactivateBusinessAction(data: any) {

    let modalData = data
    let businessId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_active', 'false')
    delData.append('modified_by', this.user_id.toString())

    const deactivSubscr = this.cbfService.alterBusinessData(delData, businessId, this.accessToken)

    .subscribe({
      next: (response: any) => {

        if(response.id){
          this.messageResponse = 'Business successfully deactivated'

          this.toaster.show(this.messageResponse, { classname: 'bg-success text-light', delay: 10000 });
          
          setTimeout(() => {
            window.location.reload()
          }, 1200);

        } else {
          this.messageResponse = 'Something went wrong, please try again' 
          this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
        this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(deactivSubscr);

  }

  activateBusinessAction(data: any) {

    let modalData = data
    let businessId = modalData.id

    const activData:FormData = new FormData()
    activData.append('is_active', 'true')
    activData.append('modified_by', this.user_id.toString())

    const activSubscr = this.cbfService.alterBusinessData(activData, businessId, this.accessToken)

    .subscribe({
      next: (response: any) => {

        if(response.id){
          this.messageResponse = 'Business successfully activated'

          this.toaster.show(this.messageResponse, { classname: 'bg-success text-light', delay: 10000 });
          
          setTimeout(() => {
            window.location.reload()
          }, 1200);

        } else {
          this.messageResponse = 'Something went wrong, please try again' 
          this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
        this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(activSubscr);

  }

  deleteMemberAction(data: any) {

    let modalData = data

    const delData:FormData = new FormData()
    delData.append('businessOwner', modalData.id)
    delData.append('user', this.user_id.toString())

    const delSubscr = this.cbfService.deleteMember(delData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.status){
          this.messageResponse = response.message

          if(response.status == 1){
            this.toaster.show(response.message, { classname: 'bg-success text-light', delay: 10000 });
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);
          } else {
            this.toaster.show(response.message, { classname: 'bg-warning text-light', delay: 10000 });
          }
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
        this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(delSubscr);

  }

  approveBusinessAction(data: any) {

    let modalData = data
    let businessId = modalData.id

    const approvData:FormData = new FormData()
    approvData.append('is_active', 'true')
    approvData.append('is_verified', 'true')
    approvData.append('modified_by', this.user_id.toString())

    const aprrovSubscr = this.cbfService.alterBusinessData(approvData, businessId, this.accessToken)

    .subscribe({
      next: (response: any) => {

        if(response.id){
          this.messageResponse = 'Business successfully verified and activated'

          this.toaster.show(this.messageResponse, { classname: 'bg-success text-light', delay: 10000 });
          
          setTimeout(() => {
            window.location.reload()
          }, 1200);

        } else {
          this.messageResponse = 'Something went wrong, please try again' 
          this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
        this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(aprrovSubscr);

  }

  revokeBusinessAction(data: any) {

    let modalData = data
    let businessId = modalData.id

    const revokeData:FormData = new FormData()
    revokeData.append('is_verified', 'false')
    revokeData.append('modified_by', this.user_id.toString())

    const revokSubscr = this.cbfService.alterBusinessData(revokeData, businessId, this.accessToken)

    .subscribe({
      next: (response: any) => {

        if(response.id){
          this.messageResponse = 'Business successfully rejected'

          this.toaster.show(this.messageResponse, { classname: 'bg-success text-light', delay: 10000 });
          
          setTimeout(() => {
            window.location.reload()
          }, 1200);

        } else {
          this.messageResponse = 'Something went wrong, please try again' 
          this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
        this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(revokSubscr);

  }
  
  
}
