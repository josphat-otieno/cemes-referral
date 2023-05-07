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
  selector: 'app-notification-message',
  templateUrl: './notification-message.component.html',
  styleUrls: ['./notification-message.component.css']
})
export class NotificationMessageComponent implements OnInit {
  
  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public categoryList:any = []
  public messageList:any = []
  public messagesCount:number = 0

  public msgModalData:any = []
  public alertResponse:string = ''
  public messageResponse:string = ''
  public msg:string = ''

  public validity:boolean = false
  public msgRegistration: FormGroup | any
  
  // Files  
  public upload = 0;

  public actualLogoFile: File | any;
  public actualCoverFile: File | any;

  public updatedLogoFile: File | any;
  public updatedCoverFile: File | any;
  
  // Logo holder
  public coverDefaultLogo: any = "assets/images/default/cover.jpg";
  public forumDefaultLogo: any = "assets/images/default/forum.png";
  
  public coverSavedLogo: any = "assets/images/default/cover.jpg";
  public forumSavedLogo: any = "assets/images/default/forum.png";

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
    this.getmessageList()
  }

  createForm() {
    this.msgRegistration = this.fb.group({
      message: ['', [Validators.required ]],
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

  handleMissingImage() {
    this.coverSavedLogo = this.coverDefaultLogo
  }

  reviewModal(content:any, data:any) {
    
    this.modalService.open(content)
    this.msgModalData = data

    // images
    this.coverSavedLogo = this.msgModalData.image
  }
   
  // Endpoints Consumption  

  getmessageList(){

    const categorySubscr = this.cbfService.getNotificationMessages(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response 
        
        this.messagesCount = result.count
        this.messageList = result.results 

        if(this.messagesCount > 0){
          this.dtTrigger.next(this.messageList)
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
    onCoverChange(event: any) {
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
          this.coverSavedLogo = img_reader.result as string;
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

  saveMessage() {

    const regData:FormData = new FormData()
    let message_content = ""
    message_content = this.msgRegistration.get('message')?.value

    if(message_content != "") {

      if(this.actualCoverFile){
        regData.append('image', this.actualCoverFile, this.actualCoverFile.name)
      }
  
      regData.append('message', message_content)
  
      const regsterSubscr = this.cbfService.saveNotificationMessage(regData, this.accessToken)
  
      .subscribe({
        next: (response: any) => {
          let results = response
          
          if(results.id){
            
            this.messageResponse = 'Message created successfully'
              
            setTimeout(() => {
              window.location.reload()
            }, 1200);
  
          } else {
            this.alertResponse = 'Message not created, please try again'
          }
          
        },
        error: (e:HttpErrorResponse) =>  {
          this.msg = 'Something went wrong, please try again'  
          this.messageResponse = this.msg
        }   
      })
      
      this.unsubscribe.push(regsterSubscr);

    } else {
      this.alertResponse = 'Please provide a message'
    }
    
  }

  updateAction(data: any) {

    let modalData = data
    let msgId = modalData.id

    let message_content = ""
    message_content = modalData.message

    if(message_content != "") {

      const updateData:FormData = new FormData()

      if(this.updatedCoverFile){
        updateData.append('image', this.updatedCoverFile, this.updatedCoverFile.name)
      }

      updateData.append('message', message_content)

      const updateSubscr = this.cbfService.updateMessage(msgId, updateData, this.accessToken)

      .subscribe({
        next: (response: any) => {
          
          if(response.id){
            
            this.messageResponse = 'Message updated successfully'
              
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

    } else {
      this.alertResponse = 'Please provide a message'
    }

  }

  deleteAction(data: any) {

    let modalData = data
    let msgId = modalData.id

    const delSubscr = this.cbfService.deleteMessage(msgId, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        this.messageResponse = 'Message deleted successfully'
            
        setTimeout(() => {
          window.location.reload()
        }, 1200);
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
      }   
    })
    
    this.unsubscribe.push(delSubscr);

  }

}
