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
  selector: 'app-events-management',
  templateUrl: './events-management.component.html',
  styleUrls: ['./events-management.component.css']
})
export class EventsManagementComponent implements OnInit {

  // public variables  
  public current_date:string = ""
  public loading:boolean = false
  public loadingEdit:boolean = false

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];
  
  public eventsListCount:number = 0;
  public eventsList:any = [];
  public eventModalData:any = [];
  public churchGroups:any = [];
  public eventRegistration: FormGroup | any
  
  public paidEvent:boolean = false
  public seat_restricted:boolean =  false;
  public paidEventUpdate:boolean = false

  public alertResponse: string = ""
  public messageResponse:string = ""
  public msg:string = ""

  // Announcement Buttons
  public annoucementButtons:any = []
  public AnnBtn:any = '';

  // Custom Form
  public formId:any
  public customFormItemData:any = []
  public max_date:string = ''

  // Files  
  public upload = 0;

  public actualFile: File | any;
  public updatedFile: File | any;
  
  public eventDefaultBanner:any = "";
  public eventDefaultBannerEdit:any = "";

  // Searchable Select
  public formList:any = []
  public selected_form:number = 0
  public selectedForm:any = []
  public form_name:string = ''
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
  
  formOptions: DataTables.Settings = {};
  formTrigger: Subject<any> = new Subject<any>();

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
    
    this.eventRegistration = this.fb.group({
      eventName: ['',Validators.required],
      eventDate: ['', Validators.required],
      startTime:[''],
      endTime:[''],
      is_paid:[''],
      per_ticket_amount:[''],
      description: [''],
      is_limited: [''],
      maximumSeats:[''],
      seatsReserved:[''],
      customForm:[''],
      event_creator: [this.user_id, Validators.required],
    
    })
    
    // get default image
    if(this.eventDefaultBanner == ''){
      let b_url = "assets/images/default/cover.jpg"
      this.eventDefaultBanner = b_url;
    }

    this.accessToken = this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)

    this.getForms()
    this.getEvents()

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

  reviewModal(content:any, data:any, size:string) {
    
    this.openModal(content, size)
    this.eventModalData = data
    
    this.formId = data.customForm
    this.form_name = data.customFormName

    if (this.eventDefaultBannerEdit == null) {
      this.eventDefaultBannerEdit = "assets/images/default/cover.jpg";
    } else {      
      this.eventDefaultBannerEdit = this.eventModalData.eventImage
    }

    if(this.formId != ''){
      this.selectedForm.push({'id': this.formId, 'name': this.form_name})
    }

  }
   

  previewModal(targetModal:string, data:any) {
    // this.spinner.show();

    if(data.customForm == null || data.customForm == ''){
      // this.spinner.hide();
      this.msg = 'No custom form attached to this event'
      // this.toaster.info(this.msg, 'Caution');

    } else {      

        this.formId = data.customForm
        this.form_name = data.customFormName

        this.modalService.open(targetModal, {
          centered: true,
          backdrop: 'static'
        });
    
        this.getFormItems()
  
        setTimeout(() => {
          // this.spinner.hide()
        }, 1400);
   
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

    let selected_form_id = item.id;
    this.selected_form = selected_form_id

  }

  onItemDeSelect(event: any) {
    this.selected_form = 0
  }

  // display groups
  selector(val:string){
    this.type = val;

    if(val == 'true'){
      this.seat_restricted = true;
    } else {
      this.seat_restricted = false;
    }

  }
  
  onChange(event: any) {
    
    this.alertResponse = ''

    const file = event.target.files[0];
    this.actualFile = file;

     // Size Filter Bytes
     const max_size = 10000000;

    if (event.length === 0)
      return;

    var mimeType = file.type
    if (mimeType.match(/image\/*/) == null) {
      this.alertResponse = "Not An Image, Only images are supported."
      return;
    } else {
      this.upload = 1;
    }

    if (file.size > max_size) {     
      this.alertResponse = "Size exceeded, Maximum size allowed is 10MB."
      return;
    } else {
      this.upload = 1;
    }
   
    if((file.type.indexOf('image/jpeg') < 0) && (file.type.indexOf('image/png') < 0)){
      this.alertResponse = "Invalid image format, only jpeg and png Images are allowed."
      return;
    } else {
      this.upload = 1;
    }
    
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.eventDefaultBanner = reader.result as string;
    }
    reader.readAsDataURL(file)

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
        this.updatedFile = file;

        const img_reader = new FileReader();
        img_reader.onload = () => {
          this.eventDefaultBannerEdit = img_reader.result as string;
        }
        img_reader.readAsDataURL(file)
      }

    } else {
      this.upload = 0;
      this.alertResponse = "Not An Image, Only images are supported."
      return;

    }
    
  }

  payCheck(event: any){
    let isChecked = event

    if(isChecked == true){
      this.paidEvent = true
    } else {
      this.paidEvent = false
      this.eventRegistration.get('per_ticket_amount')?.patchValue(0)
    }
  }

  payCheckUpdate(event: any){
    let isChecked = event
    if(isChecked == true){
      this.paidEventUpdate = true
    } else {
      this.paidEventUpdate = false
    }
  }

  //validate seats
  validate(value: any) {
    let reserved_value = value;
    let reserved_seat = this.eventRegistration.get('seatsReserved');

    let max_seats_value = this.eventRegistration.get('maximumSeats')?.value;
    let is_limited_val = this.eventRegistration.get('is_limited')?.value;

    if((reserved_value > max_seats_value) && (is_limited_val == 'true')){

      this.res_serror = true;
      reserved_seat?.patchValue('');

    } else {
      this.res_serror = false;
    }
  }

  validateEdit(value: any) {
    let reserved_value = value;  
    let max_seats_value = this.eventModalData.maximumSeats;
    let is_limited_val = this.eventModalData.is_limited;

    if((reserved_value > max_seats_value) && (is_limited_val == 'true')){
      this.res_error = true;
      this.disable = true
    } else {
      this.res_error = false;
      this.disable = false;
    }
  }
  
  //  Get Events
  getEvents(){

    const eventsSubscr = this.cbfService.getEventDetails(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   

        this.eventsListCount = result.count
        this.eventsList = result.results  

        if(result.count > 0) {
          this.dtTrigger.next(this.eventsList)
        }
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(eventsSubscr);

  }

  // Get Custom Forms
  getForms(){

    const formSubscr = this.cbfService.getCustomForms(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.formList = result.results  
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(formSubscr);

  }

  getFormItems() {
   
      const formerSubscr = this.cbfService.getCustomFormCustomFormItems(this.formId, this.accessToken)
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
          // console.log(this.customFormItemData)
        },
        error: (err: HttpErrorResponse) => {
          this.msg = 'Something went wrong, cannot fetch form details.';
        }
      });
        
      this.unsubscribe.push(formerSubscr)
  }

  // Register event
  saveEvent() {

    let formValidity:boolean = true

      this.loading = true;

      var eventDate = this.eventRegistration.controls['eventDate'].value
      let startTime = this.eventRegistration.controls['startTime'].value
      let endTime = this.eventRegistration.controls['endTime'].value
      var limited = this.eventRegistration.controls['is_limited'].value
      var content = this.eventRegistration.controls['description'].value;
      var ticketAmount = this.eventRegistration.controls['per_ticket_amount'].value;

      const formData: FormData = new FormData()

      if(this.actualFile){        
        formData.append('eventImage', this.actualFile, this.actualFile.name);
      }
      formData.append('eventName', this.eventRegistration.controls['eventName'].value);
      formData.append('seatsReserved', this.eventRegistration.controls['seatsReserved'].value);

      if(limited == 'true'){
        let limited_val:boolean = true

        if(limited == 'true'){
          limited_val = true
        } else {
          limited_val = false
        }
        
        formData.append('is_limited', limited_val.toString());
        formData.append('maximumSeats', this.eventRegistration.controls['maximumSeats'].value)
      }
      
      formData.append('eventDate', eventDate);
      formData.append('startTime', startTime);
      formData.append('endTime', endTime);
      formData.append('description', content);
      formData.append('event_creator', this.user_id.toString());

      //Custom Form
      var custom_form = this.selected_form
      if(custom_form != 0){
        let selected_form_id = custom_form
        formData.append('customForm', selected_form_id.toString())

        formValidity = true

      }

      // check Payment
      if(this.paidEvent === true){
        // check amount
        if(ticketAmount == '' || ticketAmount == 0){ 
          formValidity = false
          
          if(ticketAmount == ''){            
            this.alertResponse = "Caution, please provide the amount for a single ticket";
          }
          if(ticketAmount == 0){
            this.alertResponse = "Caution, a ticket cannot be Ksh.0, if so unselect the paid event checkbox";
          }
          
        } else {
          formValidity = true

          // set value
          formData.append('is_paid', true.toString())
          formData.append('per_ticket_amount', ticketAmount)
        }

      }

    if(formValidity === true){
     
        const eventSubscr = this.cbfService.registerEvent(formData, this.accessToken)
        .subscribe({
          next: (response: any) => {
            let results = response
            
            if(results.id){

              this.eventRegistration.reset();          
              this.messageResponse = 'Event registered successfully'
                
              setTimeout(() => {
                window.location.reload()
              }, 1400);
    
            } else {
              this.alertResponse = 'Event not created, please try again'
            }
            
          },      
          error: (err: HttpErrorResponse) => {
            this.alertResponse = 'Something went wrong, failure creating event, kindly try again';
          }
        })

        this.unsubscribe.push(eventSubscr);

    } else {
      this.loading = false;
      this.alertResponse = "Invalid Submission, you have not filled all the required fields";
    }
    
  } 

  // Update Evenyt
  updateAction(data: any) {

    let formValidity:boolean = true

      this.loadingEdit = true;

      let modalData = data
      let limited = modalData.is_limited
      let eventId = modalData.id
      let ticketAmount = modalData.per_ticket_amount

      const updateData:FormData = new FormData()      

      updateData.append('eventName', modalData.event_name)
      updateData.append('eventDate', modalData.eventDate)
      updateData.append('startTime', modalData.startTime)
      updateData.append('endTime', modalData.endTime)
      updateData.append('description', modalData.description)
      updateData.append('seatsReserved', modalData.seatsReserved)

      if(this.updatedFile){
        updateData.append('eventImage', this.updatedFile, this.updatedFile.name)
      }

      if(limited == 'true'){
        let limited_val:boolean = true

        if(limited == 'true'){
          limited_val = true
        } else {
          limited_val = false
        }
        
        updateData.append('is_limited', limited_val.toString());
        updateData.append('maximumSeats', modalData.maximumSeats)
      }
     
      //Custom Form
      if(modalData.customForm.length > 0){
        updateData.append('customForm', modalData.customForm[0].id)
      }

      // check Payment
      if(this.paidEventUpdate === true){

        // check amount
        if(ticketAmount == '' || ticketAmount == 0){ 
          formValidity = false
          
          if(ticketAmount == ''){            
            this.alertResponse = "Caution, please provide the amount for a single ticket";
          }
          if(ticketAmount == 0){
            this.alertResponse = "Caution, a ticket cannot be Ksh.0, if so unselect the paid event checkbox";
          }
          
        } else {
          formValidity = true

          // set value
          updateData.append('is_paid', true.toString())
          updateData.append('per_ticket_amount', ticketAmount)
        }

      }

      if(formValidity === true){
     
        const updateEventSubscr = this.cbfService.updateEvent(eventId, updateData, this.accessToken)
        .subscribe({
          next: (response: any) => {
            
            if(response.id){

              this.loadingEdit = false          
              this.messageResponse = 'Event updated successfully'
                
              setTimeout(() => {
                window.location.reload()
              }, 1200);
    
            } else if(response.message) {
              this.loadingEdit = false
              this.alertResponse = "Something went wrong, failure updating event, kindly try again"
            }
            
          },      
          error: (err: HttpErrorResponse) => {
            this.loadingEdit = false
            this.alertResponse = 'Something went wrong, failure updating event, kindly try again';
          }
        })

        this.unsubscribe.push(updateEventSubscr);

    } else {
      this.loadingEdit = false;
      this.alertResponse = "Invalid Submission, you have not filled all the required fields";
    }


  }

  deleteAction(data: any) {

    let modalData = data
    let eventID = modalData.id

    const delSubscr = this.cbfService.deleteEvent(eventID, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Event deleted successfully'
            
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
