import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { ApiEndpointService } from 'src/app/core/api-endpoint.service';
import { CbfService } from 'src/app/core/cbf.service';
import { LightboxConfig, Lightbox } from 'ngx-lightbox';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { Router } from '@angular/router';
import ls from 'localstorage-slim';

@Component({
  selector: 'app-business-listing',
  templateUrl: './business-listing.component.html',
  styleUrls: ['./business-listing.component.css']
})
export class BusinessListingComponent implements OnInit {

  public accessToken:string = ''  
  public user_id:number = 0

  public BusinessRegistration: FormGroup | any;
  public businessCategories:any = []
  public businessOwners:any = []
  private unsubscribe: Subscription[] = [];
  private msg:string = ''  
  public password:string =''
  public passwordValue:string =''

  // response
  public messageResponse:string = ''
  public alertResponse:string = ''

  // Files  
  public upload = 0;
  public actualFile: File | any;
  public updatedFile: File | any;

  // parameters
  public businesses:any = []
  public pendingBusinesses:any = []
  public pendingbusinessCount:number = 0
  public productsCount:number = 0
  public businessCount:number = 0
  public businessModalData:any = []

    // Images Handler
    public businessImages:any = []
    public imagesCount:number = 0
    public imagesExist: boolean = false

    // Contact Handler
    public mailContacts: any
    public mobileContacts: any
    public contactsCount:number = 0
    public contactsExist: boolean = false
    public mailCount: number = 0
    public mobileCount: number = 0

  // business Def Parameters
  public businessOwnerId:number = 0
  public businessCategory:number = 0
  public assemblyId:number = 0

  // validation parameters
  public validity:boolean = false

  public updateValidity:boolean = true
  public emptyName:boolean = false
  public emptyCategory:boolean = false
  public emptyOwner:boolean = false

  public phoneValidationMessage:boolean = false
  public emailValidationMessage:boolean = false

  // public business 
  public currentRate:number = 0
  public social_link:any = []

  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  ptOptions: any = {};
  ptTrigger: Subject<any> = new Subject<any>();

  // Logo holder
  businessDefaultLogo: any = "";
  businessLogo: any = "";
  public mediaUrl = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.IMAGE_FOLDER);

  constructor(
    private fb: FormBuilder,  
    private router: Router,  
    private toaster: ToastService,
    private modalService: NgbModal,
    private cbfService: CbfService,
    private _lightboxConfig: LightboxConfig,
    private _lightbox: Lightbox
  ) {
    this.createForm();
  }
  
  createForm() {
    this.BusinessRegistration = this.fb.group({
      name: ['', [Validators.required]],
      nature: [''],
      business_category: ['', [Validators.required]],
		  business_owner: ['', [Validators.required] ],
      physical_location: ['', [Validators.required]],
      building_name: [''],
      floor: [''],
      office_number: [''],
      certificateOfRegistration: [''],
      kraCertificate: [''],
    })
  }
  

  ngOnInit(): void {

    // remove bpd 
    ls.remove('bpd')

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
    
    //check Image
    if (this.businessDefaultLogo == '') {
      let b_url = this.mediaUrl+'default_business.png'
      this.businessDefaultLogo = b_url;
    }

    this.getBusinessCategory()
    this.getBusinessOwners()
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
      size: 'xl'
    });

	}

  // Image Management    
  open(_albumsArray:any, index: number): void {
    this._lightbox.open(_albumsArray, index, { showZoom: false, showImageNumberLabel: true, alwaysShowNavOnTouchDevices: true, fitImageInViewPort: true, disableScrolling: false, centerVertically: true });
  }
 
  close(): void {
    this._lightbox.close();
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

  reviewUpdateModal(editBiz:any, biz:any) {
    this.modalService.open(editBiz, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
    });
    this.password = ''
    let modalData = biz;

    this.businessModalData = modalData

    // get images
    this.imagesCount = this.businessModalData.business.images.count
    if(this.imagesCount > 0){
      this.imagesExist = true
      this.businessImages = this.businessModalData.business.images.list
    } else {
      this.imagesExist = false      
    }

    // Social Links
    this.social_link = [
      {
        title:"instagram",
        icon_class:"fa fa-instagram",
        link:"#",
      },
      {
        title:"twitter",
        icon_class:"fa fa-twitter",
        link:"#",
      },
      {
        title:"facebook",
        icon_class:"fa fa-facebook",
        link:"#",
      },
    ]

    // get contacts
    this.contactsCount = this.businessModalData.business.contacts.count
    if(this.contactsCount > 0){
      this.contactsExist = true
      this.mobileContacts = this.businessModalData.business.contacts.phone
      this.mailContacts = this.businessModalData.business.contacts.email
    } else {
      this.contactsExist = false
    }
  
    if (this.businessLogo == 'no_file') {
      let b_url = this.mediaUrl+'default_business.png'
      this.businessLogo = b_url;
    } else {      
      this.businessLogo = modalData.business.logo
      this.updatedFile = this.businessLogo
    }    

    // set rating
    this.currentRate = this.businessModalData.business.rating
  
  }

  /* -------------------------------------------------------------------- File management ----------------------------------------------------------------- */
    // On file Select
  onChange(event: any) {
    this.alertResponse = ''

    const file = event.target.files[0];

    if (event.length === 0)
      return;

    var mimeType = file.type

    if(mimeType.indexOf('image')> -1){

      // check if size is 10MB Max


      if (mimeType.match(/image\/*/) == null) {
        this.alertResponse = "Not An Image, Only images are supported."
        return;
      } else {
        this.upload = 1;        
        this.actualFile = file;

        const img_reader = new FileReader();
        img_reader.onload = () => {
          this.businessDefaultLogo = img_reader.result as string;
        }
        img_reader.readAsDataURL(file)
      }

    } else {
      this.upload = 0;
      this.alertResponse = "Not An Image, Only images are supported."
      return;

    }
    
  }
 
  // Change image on Update
  onUpdateChange(event: any) {
    this.alertResponse = ''

    const file = event.target.files[0];

    if (event.length === 0)
      return;

    var mimeType = file.type

    if(mimeType.indexOf('image')> -1){

      // check if size is 10MB Max
      let fileSize = file.size

      if (fileSize >= 10000000) {
        this.alertResponse = "Please select an image less than 10MB.";
        this.updateValidity = false
      } else {
        this.updateValidity = true
      }

      if (mimeType.match(/image\/*/) == null) {
        this.alertResponse = "Not An Image, Only images are supported."
        return;
      } else {
        this.upload = 1;        
        this.updatedFile = file;

        const img_reader = new FileReader();
        img_reader.onload = () => {
          this.businessLogo = img_reader.result as string;
        }
        img_reader.readAsDataURL(file)
      }

    } else {
      this.upload = 0;
      this.alertResponse = "Not An Image, Only images are supported."
      return;

    }
    
  }

  goToProducts(businessId:number){
    this.modalService.dismissAll()

    ls.set('bpd', JSON.stringify(businessId), {encrypt: true, secret: 36});

    let encryptedId = ls.get('bpd')
    this.router.navigate(['/admin/business-products'], { queryParams: { bpd: encryptedId} })
  }

  // Endpoints Consumption
  getBusinessCategory() {
    const categorySubscr = this.cbfService.getBusinessCategories(this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.businessCategories = queryResults.results        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(categorySubscr);
  }

  getBusinessOwners() {
    const ownersSubscr = this.cbfService.getBusinessOwnerList(this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.businessOwners = queryResults.results        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(ownersSubscr);
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
        
        if(queryResults.count > 0){
          this.dtTrigger.next(this.businesses)
        }
        
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

  saveBusiness() {

    const regData:FormData = new FormData()

    if (!this.actualFile) {

      this.alertResponse = 'Caution, Kindly select an image to upload';
      
    } else {      

      regData.append('logo', this.actualFile, this.actualFile.name);

    }    

    regData.append('name', this.BusinessRegistration.get('name')?.value)
    regData.append('nature', this.BusinessRegistration.get('nature')?.value)
    regData.append('physical_location', this.BusinessRegistration.get('physical_location')?.value)
    regData.append('floor', this.BusinessRegistration.get('floor')?.value)
    regData.append('building_name', this.BusinessRegistration.get('building_name')?.value)
    regData.append('office_number', this.BusinessRegistration.get('office_number')?.value)
    regData.append('business_owner', this.BusinessRegistration.get('business_owner')?.value)
    regData.append('business_category', this.BusinessRegistration.get('business_category')?.value)
    regData.append('is_active', true.toString())
    regData.append('is_verified', true.toString())
    regData.append('user', this.user_id.toString())

    const regsterSubscr = this.cbfService.registerBusiness(regData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let results = response
        
        if(results.id){
          
          this.messageResponse = results.message

          setTimeout(() => {
            window.location.reload()
          }, 1200);
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.alertResponse = 'Something went wrong registering the business, please try again'  
        this.toaster.show(this.msg, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(regsterSubscr);
  }

  updateBusiness (data: any) {
    this.alertResponse = ''

    let editData = data
    let businessId = editData.id

    let businessName = editData.name
    let businessCategory = editData.categoryId
    let businessOwner = editData.ownerId

    // validation fields
    if(businessName == 0 || businessCategory == 0 || businessOwner == 0){
      this.updateValidity = false

      if(businessName == 0){
        this.emptyName = true
      } else {
        this.emptyName = false
      }
      if(businessCategory == 0){
        this.emptyCategory = true
      } else {
        this.emptyCategory = false
      }
      if(businessOwner == 0){
        this.emptyOwner = true
      } else {
        this.emptyOwner = false
      }

    } else {
      this.updateValidity = true
    }

    // Submit Form
    if(this.updateValidity == true){

      const updateData:FormData = new FormData()

      if (!this.updatedFile) {
        this.alertResponse = 'Caution, Kindly select an image to upload';      
      } else {     
        updateData.append('logo', this.updatedFile, this.updatedFile.name);
      }    
  
      updateData.append('name', businessName)
      updateData.append('nature', editData.nature)
      updateData.append('physical_location', editData.location)
      updateData.append('floor',editData.floor)
      updateData.append('building_name', editData.building)
      updateData.append('office_number', editData.office)
      updateData.append('business_owner', businessOwner)
      updateData.append('business_category', businessCategory)
  
      const updateSubscr = this.cbfService.updateBusiness(updateData, businessId, this.accessToken)
  
      .subscribe({
        next: (response: any) => {
          let results = response
          
          if(results.id){
            
            this.messageResponse = 'Business successfully updated'
  
            setTimeout(() => {
              window.location.reload()
            }, 1200);
            
          }
          
        },
        error: (e:HttpErrorResponse) =>  {
          this.alertResponse = 'Something went wrong registering the business, please try again'  
          this.toaster.show(this.msg, { classname: 'bg-warning text-light', delay: 10000 });
        }   
      })
      
      this.unsubscribe.push(updateSubscr);
      
    } else {
      this.alertResponse = 'Please ensure all required fields are filled'
    }

  }

  deactivateBusinessAction(data: any) {

    let modalData = data
    let businessId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_active', 'false')
    delData.append('modified_by', this.user_id.toString())

    const deactivSubscr = this.cbfService.updateBusiness(delData, businessId, this.accessToken)

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

    const activSubscr = this.cbfService.updateBusiness(activData, businessId, this.accessToken)

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

  deleteBusinessAction(data: any) {

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

    const aprrovSubscr = this.cbfService.updateBusiness(approvData, businessId, this.accessToken)

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

    const revokSubscr = this.cbfService.updateBusiness(revokeData, businessId, this.accessToken)

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
