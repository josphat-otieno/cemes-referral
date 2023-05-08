import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ls from 'localstorage-slim';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject, Subscription, throwError } from 'rxjs';
import { ApiEndpointService } from 'src/app/core/api-endpoint.service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-event-notifications',
  templateUrl: './event-notifications.component.html',
  styleUrls: ['./event-notifications.component.css']
})
export class EventNotificationsComponent implements OnInit {
  
  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  public dataErrorMsg:string = "No data available for display"

  // parameters
  public messageList:any = []
  public reminderList:any = []
  public reminderCount:number = 0
  public current_date:string = ""

  public notificationModalData:any = []
  public alertResponse:string = ''
  public messageResponse:string = ''
  public msg:string = ''

  public selected_message:number = 0
  public selected_message_object:any = []
  dropdownSettings!:IDropdownSettings;

  public validity:boolean = false
  public notificationRegistration: FormGroup | any

  // Event Title
  public eventName:string = ""
  public filtered_event_id:number = 0;
  public title:string = "List of all notification reminders for this event"
  
  // Files  
  public upload = 0;

  public actualLogoFile: File | any;
  public actualCoverFile: File | any;

  public updatedLogoFile: File | any;
  public updatedCoverFile: File | any;

  public mediaUrl = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.IMAGE_FOLDER);
  
  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private cbfService: CbfService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {  }
  

  ngOnInit(): void {
    
    this.accessToken = this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)

    // Limit previous dates
    let date = Date();
    var dateString = moment(date).format('YYYY-MM-DD');
    this.current_date = dateString

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

    this.activatedRoute.queryParams.subscribe(params => {
      const uid = params['evn']; 

      if (uid != undefined) {       
        this.filtered_event_id = uid;
      } else {
        this.router.navigate(['/admin/events-management'])
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

    this.getEventDetail()
    this.createForm()
    this.getmessageList()
    this.getreminderList()
  }

  createForm() {
    this.notificationRegistration = this.fb.group({
      message: ['', [Validators.required ]],
      notification_date: ['', [Validators.required ]],
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
    this.notificationModalData = data

    if( this.notificationModalData.message_id != ''){

      let trim = this.notificationModalData.message.substring(0, 30) + ' ...';      
      this.selected_message_object.push({'id': this.notificationModalData.message_id, 'name': trim})

    }

  }

  onItemSelect(item: any) {

    let selected_message_id = item.id;
    this.selected_message = selected_message_id

  }

  onItemDeSelect(event: any) {
    this.selected_message = 0
  }
  
   
  /* ------------------------------------------ Endpoints Consumption --------------------------------------------------- */

  getEventDetail() {

    const eventsSubscr = this.cbfService.getEventDetails(this.filtered_event_id, this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response.results
        let counter = response.count

        this.eventName = result[0].event_name 
        return this.title = "Showing " + counter + " notification reminder(s) for " + this.eventName
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(eventsSubscr)

  }

  getreminderList(){

    const categorySubscr = this.cbfService.getEventReminders(this.filtered_event_id, this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response 
        
        let eventMessage = result.message
        if(eventMessage == 'pass') {

          this.reminderCount = result.count
          this.reminderList = result.results 

          if(this.reminderCount > 0){
            this.dtTrigger.next(this.reminderList)
          }     

        } else {
          this.dataErrorMsg = eventMessage
        }            
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(categorySubscr);

  }

  getmessageList(){

    const msgSubscr = this.cbfService.getNotificationMessages(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response.results 

        result.forEach((x:any) => {
          let msg_id = x.id
          let msg_truncated = x.message.substring(0,30) + ' ...';

          let msg_object = {'id':msg_id, 'name':msg_truncated}           
          this.messageList.push(msg_object) 

        })
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(msgSubscr);

  }


  saveNotification() {

    const regData:FormData = new FormData()
    let message_id = 0
    let message_object = this.notificationRegistration.get('message')?.value
    let datum = this.notificationRegistration.get('notification_date')?.value

    message_id = message_object[0].id

    if(message_id != 0) {
  
      regData.append('event_id', this.filtered_event_id.toString())
      regData.append('message_id', message_id.toString())
      regData.append('notification_date', datum)
  
      const regsterSubscr = this.cbfService.createCustomNotification(regData, this.accessToken)
  
      .subscribe({
        next: (response: any) => {
          let results = response
          
          if(results.id){
            
            this.messageResponse = 'Notification reminder created successfully'
              
            setTimeout(() => {
              window.location.reload()
            }, 1200);
  
          } else {
            this.alertResponse = 'Notification reminder not created, please try again'
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
    let reminderId = modalData.id

    let message_id = 0
    let message_content = modalData.message
    let notification_Date = modalData.notification_date
    message_id = message_content[0].id

    if(message_id != 0) {

      const updateData:FormData = new FormData()
      updateData.append('message', message_id.toString())
      updateData.append('notification_date', notification_Date)

      const updateSubscr = this.cbfService.updateReminder(reminderId, updateData, this.accessToken)

      .subscribe({
        next: (response: any) => {
          
          if(response.id){
            
            this.messageResponse = 'Notification reminder updated successfully'
              
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

    const delSubscr = this.cbfService.deleteReminder(msgId, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        this.messageResponse = 'Notification reminder deleted successfully'
            
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
