import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { ApiEndpointService } from 'src/app/core/api-endpoint.service';
import { CbfService } from 'src/app/core/cbf.service';
import { LightboxConfig, Lightbox } from 'ngx-lightbox';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { ActivatedRoute, Router } from '@angular/router';
import ls from 'localstorage-slim';

@Component({
  selector: 'app-business-products',
  templateUrl: './business-products.component.html',
  styleUrls: ['./business-products.component.css']
})
export class BusinessProductsComponent implements OnInit {

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
  public selectedBusiness:number = 0 
  public businessName:string = ''
  
  public verifiedProducts:any = []
  public pendingProducts:any = []
  public pendingProductsCount:number = 0
  public productsCount:number = 0
  public verifiedProductCount:number = 0
  public productModalData:any = []

    // Images Handler
    public productImages:any = []
    public imagesCount:number = 0
    public imagesExist: boolean = false

    // Contact Handler
    public mailContacts: any
    public mobileContacts: any
    public contactsCount:number = 0
    public contactsExist: boolean = false
    public mailCount: number = 0
    public mobileCount: number = 0

  // Product list Def Parameters
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
    private activatedRoute: ActivatedRoute,
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

    this.activatedRoute.queryParams.subscribe(params => {
      const bpd = params['bpd'];  
      let encrypted_id = ls.get('bpd')
      
      // check if they're same
      if(bpd == encrypted_id){
        let decryptedId = ls.get('bpd', {decrypt: true, secret: 36});         
        this.selectedBusiness = Number(decryptedId);

      } else {
        this.selectedBusiness = 0
        ls.remove('bpd')
        this.router.navigate(['/admin/business-products'])
      }
      
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

    this.getVerifiedProductsList(this.assemblyId, this.selectedBusiness, this.businessOwnerId, this.businessCategory)
    this.getPendingProductsList(this.assemblyId, this.selectedBusiness, this.businessOwnerId, this.businessCategory)

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
    this.productModalData = data
  }

  reviewUpdateModal(editBiz:any, biz:any) {
    this.modalService.open(editBiz, {
      centered: true,
      backdrop: 'static',
      size: 'xl',
    });
    this.password = ''
    let modalData = biz;

    this.productModalData = modalData

    // get images
    this.imagesCount = this.productModalData.product.images.count
    if(this.imagesCount > 0){
      this.imagesExist = true
      this.productImages = this.productModalData.product.images.list
    } else {
      this.imagesExist = false      
    }
  
  }

  // Endpoints Consumption
 
  getVerifiedProductsList(assembly:number, businessId:number, businessOwner:number, category:number) {
    let verificationStatus = true
    const vprodSubscr = this.cbfService.getVerifiedProducts(verificationStatus, assembly, businessId, businessOwner, category, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.verifiedProductCount = queryResults.count
        this.verifiedProducts = queryResults.results
        
        this.productsCount = this.verifiedProductCount

        this.dtTrigger.next(this.verifiedProducts)
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(vprodSubscr);

  }

  getPendingProductsList(assembly:number, businessId:number, businessOwner:number, category:number) {
    let verificationStatus = false
    const pProdSubscr = this.cbfService.getVerifiedProducts(verificationStatus, assembly, businessId, businessOwner, category, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.pendingProductsCount = queryResults.count
        this.pendingProducts = queryResults.results

        if(queryResults.count > 0){
          this.ptTrigger.next(this.pendingProducts)
        }
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(pProdSubscr);

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

  deactivateProduct(data: any) {

    let modalData = data
    let productId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_deleted', 'false')
    delData.append('modified_by', this.user_id.toString())

    const deactivSubscr = this.cbfService.updateProduct(delData, productId, this.accessToken)

    .subscribe({
      next: (response: any) => {

        if(response.id){
          this.messageResponse = 'Product successfully deactivated'

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

  activateProduct(data: any) {

    let modalData = data
    let productId = modalData.id

    const activData:FormData = new FormData()
    activData.append('is_deleted', 'true')
    activData.append('modified_by', this.user_id.toString())

    const activSubscr = this.cbfService.updateProduct(activData, productId, this.accessToken)

    .subscribe({
      next: (response: any) => {

        if(response.id){
          this.messageResponse = 'Product successfully activated'

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

  approveProduct(data: any) {

    let modalData = data
    let productId = modalData.id

    const approvData:FormData = new FormData()
    approvData.append('is_verified', 'true')
    approvData.append('verified_by', this.user_id.toString())

    const aprrovSubscr = this.cbfService.updateProduct(approvData, productId, this.accessToken)

    .subscribe({
      next: (response: any) => {

        if(response.id){
          this.messageResponse = 'Product successfully verified and activated'

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

  revokeProduct(data: any) {

    let modalData = data
    let productId = modalData.id

    const revokeData:FormData = new FormData()
    revokeData.append('is_verified', 'false')
    revokeData.append('modified_by', this.user_id.toString())

    const revokSubscr = this.cbfService.updateProduct(revokeData, productId, this.accessToken)

    .subscribe({
      next: (response: any) => {

        if(response.id){
          this.messageResponse = 'Product successfully rejected'

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
