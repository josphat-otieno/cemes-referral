import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  
  public eventDefaultBanner:any = "";
  public eventDefaultBannerEdit:any = "";

  // Searchable Select
  public formList:any = []
  public selected_form:number = 0
  public selectedForm:any = []
  public form_name:string = ''
  dropdownSettings!:IDropdownSettings;

  // Validation
  public type: string = "";
  public res_serror: boolean = false;

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

    
    alert(this.seat_restricted)
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
    if(reserved_value > max_seats_value){
      this.res_serror = true;
      reserved_seat?.patchValue('');
    } else {
      this.res_serror = false;
    }
  }
  
  //  Get custom form Items
  getFormItems(){

    const categorySubscr = this.cbfService.getActiveBusinessCategories(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   

        // this.categoryList = result.results  
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(categorySubscr);

  }

  // getFormItems() {
  //   let jwt = this.cookieService.get('JTW')
  //   this.jumuishaService.getAccess(jwt).subscribe(response => {
  //     let access = response.access
  //     this.jumuishaService.getCustomFormCustomFormItems(this.formId, access).subscribe(res => {
  //       let formItems = (res['results'])
  //       let result = formItems.map((custom_form_item_id) => custom_form_item_id.custom_form_item_id)
  //       let itemReturnedArray : any = []
  //       result.forEach((x: number) => {
  //         let itemId = x
  //         this.jumuishaService.getCustomFormItem(itemId, access).subscribe((resp: any) => {
  //         //  let itemReturned = resp
  //           let id = resp['id']
  //           let title = resp['title']
  //           let dataType = resp['dataType']
  //           let formValue = resp['value']
  //           let hint = resp['hint']
  //           let  value: any = []

  //           let valueItems = formValue.split(',')
  //           let valueArray : any = []

  //           valueItems.forEach((x :any )=> {

  //             let item= {'name': x }
  //             valueArray.push(item)
  //           })
  //           if (formValue ==''){
  //             value = ''
  //           }else{
  //             value = valueArray
  //           }

  //           let date:string = ''
  //           if((title.indexOf('Birth') > -1) || (title.indexOf('birth') > -1)){
  //             date = this.max_date
  //           } else{
  //             // get date
  //             var today = new Date();
  //             date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  //             this.max_date = date
  //           }

  //           let itemReturned = {'id': id, 'title': title, 'date':date, 'dataType': dataType, 'value': value, 'hint': hint}
  //           itemReturnedArray.push(itemReturned)
        
  //         })

  //       })
  //       this.customFormItemData = itemReturnedArray
  //       // console.log(this.customFormItemData)

  //     },
  //     (error: HttpErrorResponse) => {
  //       this.msg = 'Something is wrong, cannot fetch form.';
  //       this.toaster.warning(this.msg, 'An Error occured');
  //       this.spinner.hide();
  //     })

  //   })
  // }

  saveEvent () {

  }

}
