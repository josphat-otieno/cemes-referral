import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject, Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';
import { PermissionComponent } from 'src/app/pages/permission/permission.component';

@Component({
  selector: 'app-event-program',
  templateUrl: './event-program.component.html',
  styleUrls: ['./event-program.component.css']
})
export class EventProgramComponent implements OnInit {

  // public variables  
  public current_date:string = ""
  public loading:boolean = false
  public loadingEdit:boolean = false
  public loadingItemEdit:boolean = false
  public program_data_loading:boolean = true

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];
  
  public programListCount:number = 0;
  public programList:any = [];
  public programData:any = [];
  public eventModalData:any = [];
  public itemData:any = [];
  public churchGroups:any = [];
  public programRegistration: FormGroup | any
  public programItemRegistration: FormGroup | any
  
  public paidEvent:boolean = false
  public seat_restricted:boolean =  false;
  public paidEventUpdate:boolean = false

  public alertResponse: string = ""
  public messageResponse:string = ""
  public formResponse:string = ""
  public msg:string = ""

  // Announcement Buttons
  public annoucementButtons:any = []
  public AnnBtn:any = '';

  // Custom Form
  public eventId:any
  public customFormItemData:any = []
  public max_date:string = ''

  // Files  
  public upload = 0;
  public editUpload = 1;

  public actualFile: File | any;
  public updatedFile: File | any;
  
  public eventDefaultBanner:any = "";
  public eventDefaultBannerEdit:any = "";

  // Searchable Select
  public eventList:any = []
  public selected_event:number = 0
  public selectedProgram:number = 0
  public selectedEvent:any = []
  public program_name:string = ''
  dropdownSettings!:IDropdownSettings;

  // Validation
  public disable:boolean = false;
  public type: string = "";
  public res_serror: boolean = false;
  public res_error: boolean = false;

  // Permissions  
  public isChangeEventAllowed: boolean = false
  public isDeleteEventAllowed: boolean = false
  public isChangeCustomFormAllowed: boolean = false

  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private modalService: NgbModal,
    private cbfService: CbfService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    // Limit previous dates
    let date = Date();
    var dateString = moment(date).format('YYYY-MM-DD');
    this.current_date = dateString

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

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    
    this.programRegistration = this.fb.group({
      event: ['',Validators.required]    
    })
    
    this.programItemRegistration = this.fb.group({
      item_name: ['', Validators.required],
      speaker: [''],
      youtube_link: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      program: [''],
    })

    // get default image
    if(this.eventDefaultBanner == ''){
      let b_url = "assets/images/big/event2.jpg"
      this.eventDefaultBanner = b_url;
    }

    this.accessToken = this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)

    this.getEvents()
    this.getPrograms()

  }

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

  itemModal(content:any, data:any) {

    this.itemData = data    
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });

	}

  reviewModal(content:any, data:any, size:string) {
    
    this.eventModalData = data
    this.selectedProgram = data.id

    let event_name = data.event_name
    
    this.eventId = data.event_id
    this.program_name = data.name
    
    if(this.eventId != ''){
      this.selectedEvent.push({'id': this.eventId, 'name': event_name})
    }

    this.openModal(content, size)  

  }
  
   // preview program design
   viewProgramTemplate(targetModal:any, data:any) {

    let program_Data = data
    
    this.program_name = program_Data.name
    let itemCount = program_Data.items.count

    if(itemCount <= 0) {

      this.program_data_loading = false
      this.formResponse = 'There are no items attached to this program';

    } else { 
      
        this.programData = program_Data

        this.modalService.open(targetModal, {
          centered: true,
          backdrop: 'static'
        });
  
        setTimeout(() => {
          this.program_data_loading = false
        }, 1600);
   
    }   

  }

  openPerm() {
    this.modalService.open(PermissionComponent);
  }

  openModals(targetModal: string, data: any) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });
    let modal_data = data
    this.eventModalData = modal_data
  
  }

  onItemSelect(item: any) {

    let selected_event_id = item.id;
    this.selected_event = selected_event_id

  }

  onItemDeSelect(event: any) {
    this.selected_event = 0
  }
  
  //  Get Events
  getPrograms(){

    const progSubscr = this.cbfService.getProgramDetails(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   

        this.programListCount = result.count
        this.programList = result.results 

        if(result.count > 0) {
          this.dtTrigger.next(this.programList)
        }
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(progSubscr);

  }

  // Get event list
  getEvents(){

    const eventsSubscr = this.cbfService.getEventDetails(0, this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response  
        
        let eventArray:any = []

        let eventsArr = result.results
        eventsArr.forEach((x:any) => {

          let eventId = x.id
          let eventName = x.event_name
          eventArray.push({'id':eventId, 'name':eventName})

        })

        this.eventList = eventArray       
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(eventsSubscr);

  }

  getFormItems() {
   
      const formerSubscr = this.cbfService.getCustomFormCustomFormItems(this.eventId, this.accessToken)
      .subscribe({
        next: (res: any) => {

          let formItems = (res['results'])
          let result = formItems.map((custom_form_item_id:any) => custom_form_item_id.custom_form_item_id)

          let itemReturnedArray : any = []
          result.forEach((x: number) => {

            let itemId = x
            this.cbfService.getCustomFormItem(itemId, this.accessToken).subscribe((resp: any) => {

            //  let itemReturned = resp
              let id = resp['id']
              let title = resp['title']
              let dataType = resp['dataType']
              let formValue = resp['value']
              let hint = resp['hint']
              let  value: any = []

              if(formValue != null) {
                let valueItems = formValue.split(',')
                let valueArray : any = []
    
                valueItems.forEach((x :any )=> {
    
                  let item= {'name': x }
                  valueArray.push(item)
                })
                if (formValue ==''){
                  value = ''
                }else{
                  value = valueArray
                }
              } 
  
              let date:string = ''
              if((title.indexOf('Birth') > -1) || (title.indexOf('birth') > -1)){
                date = this.max_date
              } else{
                // get date
                var today = new Date();
                date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                this.max_date = date
              }
  
              let itemReturned = {'id': id, 'title': title, 'date':date, 'dataType': dataType, 'value': value, 'hint': hint}
              itemReturnedArray.push(itemReturned)
          
            })
  
          })
          this.customFormItemData = itemReturnedArray
          
        },
        error: (err: HttpErrorResponse) => {
          this.formResponse = 'Something went wrong fetching the form preview, please try again later';
        }
      });
        
      this.unsubscribe.push(formerSubscr)
  }

  /* ----------------------------------------- Program Items ---------------------------------------------- */

  refreshData() {
    this.modalService.dismissAll()

    this.programItemRegistration.reset()
              
    // refresh data
    this.dtTrigger.unsubscribe()
    this.getPrograms()
  }
  
  saveProgramItem() {

    let formValidity:boolean = false

    this.loading = true;

    var program_id:Number = 0;
    program_id = this.selectedProgram

    let speaker = ""
    let itemName = ""
    let youtube = ""

    itemName = this.programItemRegistration.controls['item_name'].value
    speaker = this.programItemRegistration.controls['speaker'].value
    youtube = this.programItemRegistration.controls['youtube_link'].value
    let startTime = this.programItemRegistration.controls['startTime'].value
    let endTime = this.programItemRegistration.controls['endTime'].value

    if(program_id != 0) {
      formValidity = true
    }

    if(formValidity === true){       

      const formData: FormData = new FormData()
      formData.append('item_name', itemName);
      formData.append('speaker', speaker);
      formData.append('youtube_link', youtube);
      formData.append('startTime', startTime.toString());
      formData.append('endTime', endTime.toString());
      formData.append('program', program_id.toString());
        
        const progItemSubscr = this.cbfService.createProgramItem(formData, this.accessToken)
        .subscribe({
          next: (response: any) => {
            let results = response
            
            if(results.id){

              this.loading = false;         
              this.messageResponse = 'Program item registered successfully'
                
              setTimeout(() => {
                this.refreshData();
              }, 1400);
    
            } else {
              this.alertResponse = 'Program item not created, please try again'
            }
            
          },      
          error: (err: HttpErrorResponse) => {
            this.loading = false;
            this.alertResponse = 'Something went wrong, failure creating program item, kindly try again';
          }
        })

        this.unsubscribe.push(progItemSubscr);

    } else {
      this.loading = false;
      this.alertResponse = "Invalid Submission, please select an event to proceed";
    }

  }

  updateItem(data: any) {

    let formValidity:boolean = true
    this.loadingEdit = true;
    let modalData = data

    let program_id = modalData.program
    let program_item_id = modalData.id

    if(program_id == 0) {
      formValidity = false;
    }

    if(formValidity === true){

      const updateData:FormData = new FormData()  
      updateData.append('item_name', modalData.item_name);
      updateData.append('speaker', modalData.speaker);
      updateData.append('youtube_link', modalData.youtube_link);
      updateData.append('startTime', modalData.startTime.toString());
      updateData.append('endTime', modalData.endTime.toString());
      updateData.append('program', program_id.toString());
       
      const updateEventSubscr = this.cbfService.updateProgramItem(program_item_id, updateData, this.accessToken)
      .subscribe({
        next: (response: any) => {
          
          if(response.id){

            this.loadingEdit = false          
            this.messageResponse = 'Program item updated successfully'
              
            setTimeout(() => {
              this.refreshData();
            }, 1200);
  
          } else if(response.message) {
            this.loadingEdit = false
            this.alertResponse = "Something went wrong, failure updating program item, kindly try again"
          }
          
        },      
        error: (err: HttpErrorResponse) => {
          this.loadingEdit = false
          this.alertResponse = 'Something went wrong, failure updating program item, kindly try again';
        }
      })

      this.unsubscribe.push(updateEventSubscr);

    } else {
      this.loadingEdit = false;
      this.alertResponse = "Invalid Submission, program data was not fetched correctly. Please try again";
    }

  }

  deleteItem(data: any) {

    let modalData = data
    let itemId = modalData.id

    const delSubscr = this.cbfService.deleteProgramItem(itemId, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        this.messageResponse = 'Program Item deleted successfully'
            
        setTimeout(() => {
          this.refreshData();
        }, 1200);
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
      }   
    })
    
    this.unsubscribe.push(delSubscr);

  }

  /* -------------------------------------- End of Program Items ---------------------------------------------- */

  // Register Program
  saveProgram() { 

    let formValidity:boolean = true

    this.loading = true;

    var event_id:Number = 0;
    event_id = this.selected_event

    if(event_id != 0) {
      formValidity = true
    }

    if(formValidity === true){       

      const formData: FormData = new FormData()
      formData.append('event', event_id.toString());
        
        const eventSubscr = this.cbfService.createProgram(formData, this.accessToken)
        .subscribe({
          next: (response: any) => {
            let results = response
            
            if(results.id){

              this.loading = false;         
              this.messageResponse = 'Event program registered successfully'
                
              setTimeout(() => {
                window.location.reload()
              }, 1400);
    
            } else {
              this.alertResponse = 'Event program not created, please try again'
            }
            
          },      
          error: (err: HttpErrorResponse) => {
            this.loading = false;
            this.alertResponse = 'Something went wrong, failure creating event, kindly try again';
          }
        })

        this.unsubscribe.push(eventSubscr);

    } else {
      this.loading = false;
      this.alertResponse = "Invalid Submission, please select an event to proceed";
    }
    
  } 

  // Update Program
  updateAction(data: any) {

    let formValidity:boolean = true
    this.loadingEdit = true;
    let modalData = data

    let program_id = modalData.id

    if(formValidity === true){

      const updateData:FormData = new FormData()   
      updateData.append('event', modalData.event[0].id)
       
      const updateEventSubscr = this.cbfService.updateEventProgram(program_id, updateData, this.accessToken)
      .subscribe({
        next: (response: any) => {
          
          if(response.id){

            this.loadingEdit = false          
            this.messageResponse = 'Event program updated successfully'
              
            setTimeout(() => {
              window.location.reload()
            }, 1200);
  
          } else if(response.message) {
            this.loadingEdit = false
            this.alertResponse = "Something went wrong, failure updating the program, kindly try again"
          }
          
        },      
        error: (err: HttpErrorResponse) => {
          this.loadingEdit = false
          this.alertResponse = 'Something went wrong, failure updating the program, kindly try again';
        }
      })

      this.unsubscribe.push(updateEventSubscr);

    } else {
      this.loadingEdit = false;
      this.alertResponse = "Invalid Submission, please select an event to update";
    }

  }

  deleteAction(data: any) {

    let modalData = data
    let programId = modalData.id

    const delSubscr = this.cbfService.deleteEventProgram(programId, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        this.messageResponse = 'Event program deleted successfully'
            
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
