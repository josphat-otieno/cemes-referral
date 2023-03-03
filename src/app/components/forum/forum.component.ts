import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ls from 'localstorage-slim';
import { Subject, Subscription, throwError } from 'rxjs';
import { ApiEndpointService } from 'src/app/core/api-endpoint.service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public categoryList:any = []
  public forumList:any = []
  public forumCount:number = 0

  public forumModalData:any = []
  public alertResponse:string = ''
  public messageResponse:string = ''
  public msg:string = ''

  public validity:boolean = false
  public forumRegistration: FormGroup | any
  
  // Files  
  public upload = 0;

  public actualLogoFile: File | any;
  public actualCoverFile: File | any;

  public updatedLogoFile: File | any;
  public updatedCoverFile: File | any;
  
  // Logo holder
  coverDefaultLogo: any = "assets/images/default/cover.jpg";
  forumDefaultLogo: any = "assets/images/default/forum.png";
  public mediaUrl = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.IMAGE_FOLDER);
  
  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private cbfService: CbfService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router
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
    this.getCategories()
    this.getForumList()
  }

  createForm() {
    this.forumRegistration = this.fb.group({
      name: ['', [Validators.required ]],
      description: ['', [Validators.required ]],
      category: ['', [Validators.required ]],
      type: ['', [Validators.required ]],
    })
  }

  
  // modals
  openModal(content:any, size:string) {

    // reset messages
    this.messageResponse = ''
    this.alertResponse = ''
    
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

	}

  reviewModal(content:any, data:any) {

    this.modalService.open(content)
    this.forumModalData = data

    // images
    this.updatedCoverFile = this.forumModalData.cover
    this.updatedLogoFile = this.forumModalData.logo
  }
   
  // Endpoints Consumption  
  
  goToMembers(forumId:number){
    this.modalService.dismissAll()

    ls.set('fpd', JSON.stringify(forumId), {encrypt: true, secret: 43});

    let encryptedId = ls.get('fpd')
    this.router.navigate(['/admin/forum-management'], { queryParams: { fpd: encryptedId} })
  }

  getCategories(){

    const categorySubscr = this.cbfService.getActiveBusinessCategories(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   

        this.categoryList = result.results  
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(categorySubscr);

  }

  getForumList(){

    const categorySubscr = this.cbfService.getForumListing(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.forumCount = result.count
        this.forumList = result.results 

        if(this.forumCount > 0){
          this.dtTrigger.next(this.forumList)
        }        
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(categorySubscr);

  }

  /* ------------------------------------------ Image Handler --------------------------------------------------- */
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
          this.actualLogoFile = file;
  
          const img_reader = new FileReader();
          img_reader.onload = () => {
            this.forumDefaultLogo = img_reader.result as string;
          }
          img_reader.readAsDataURL(file)
        }
  
      } else {
        this.upload = 0;
        this.alertResponse = "Not An Image, Only images are supported."
        return;
  
      }
      
    }

    onCoverChange(event: any) {
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
          this.actualCoverFile = file;
  
          const img_reader = new FileReader();
          img_reader.onload = () => {
            this.coverDefaultLogo = img_reader.result as string;
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
      }

      if (mimeType.match(/image\/*/) == null) {
        this.alertResponse = "Not An Image, Only images are supported."
        return;
      } else {
        this.upload = 1;        
        this.updatedLogoFile = file;

        const img_reader = new FileReader();
        img_reader.onload = () => {
          this.updatedLogoFile = img_reader.result as string;
        }
        img_reader.readAsDataURL(file)
      }

    } else {
      this.upload = 0;
      this.alertResponse = "Not An Image, Only images are supported."
      return;

    }
    
  }

  onCoverUpdateChange(event: any) {
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
      }

      if (mimeType.match(/image\/*/) == null) {
        this.alertResponse = "Not An Image, Only images are supported."
        return;
      } else {
        this.upload = 1;        
        this.updatedCoverFile = file;

        const img_reader = new FileReader();
        img_reader.onload = () => {
          this.updatedCoverFile = img_reader.result as string;
        }
        img_reader.readAsDataURL(file)
      }

    } else {
      this.upload = 0;
      this.alertResponse = "Not An Image, Only images are supported."
      return;

    }
    
  }
   
  /* ------------------------------------------ Image Handler --------------------------------------------------- */

  saveForum() {

    const regData:FormData = new FormData()

    if(this.actualCoverFile){
      regData.append('cover_photo', this.actualCoverFile, this.actualCoverFile.name)
    }
    if(this.actualLogoFile){
      regData.append('forum_image', this.actualLogoFile, this.actualLogoFile.name)
    }

    regData.append('name', this.forumRegistration.get('name')?.value)
    regData.append('description', this.forumRegistration.get('description')?.value)
    regData.append('category', this.forumRegistration.get('category')?.value)
    regData.append('type', this.forumRegistration.get('type')?.value)
    regData.append('created_by', this.user_id.toString())
    regData.append('modified_by', this.user_id.toString())

    const regsterSubscr = this.cbfService.registerForum(regData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let results = response
        
        if(results.id){
          
          this.messageResponse = 'Forum created successfully'
            
          setTimeout(() => {
            window.location.reload()
          }, 1200);

        } else {
          this.alertResponse = 'Forum not updated, your name or description may have been flagged for profanity'
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.msg = 'Something went wrong, please try again'  
        this.messageResponse = this.msg
      }   
    })
    
    this.unsubscribe.push(regsterSubscr);
  }

  updateAction(data: any) {

    let modalData = data
    let ForumId = modalData.id

    const updateData:FormData = new FormData()

    if(this.updatedCoverFile){
      updateData.append('cover_photo', this.updatedCoverFile, this.updatedCoverFile.name)
    }
    if(this.updatedLogoFile){
      updateData.append('forum_image', this.updatedLogoFile, this.updatedLogoFile.name)
    }

    updateData.append('name', modalData.name)
    updateData.append('description', modalData.description)
    updateData.append('category', modalData.categoryId)
    updateData.append('type', modalData.type)
    updateData.append('modified_by', this.user_id.toString())

    const updateSubscr = this.cbfService.updateForum(updateData, ForumId,  this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Forum updated successfully'
            
          setTimeout(() => {
            window.location.reload()
          }, 1200);

        } else if(response.message) {
          this.alertResponse = response.message
        }
        
      },
              
      error: (error) =>  {
        console.log(error)       
        // this.messageResponse = error
        this.messageResponse = 'Something went wrong, please try again'  
      }  
    })
    
    this.unsubscribe.push(updateSubscr);

  }

  deleteAction(data: any) {

    let modalData = data
    let ForumId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_deleted', true.toString())
    delData.append('modified_by', this.user_id.toString())

    const delSubscr = this.cbfService.updateForum(delData, ForumId, this.accessToken)

    .subscribe({
      next: (response: any) => {

        console.log(response)
        
        if(response.id){
          
          this.messageResponse = 'Forum deleted successfully'
            
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
