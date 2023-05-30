import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-event-payments',
  templateUrl: './event-payments.component.html',
  styleUrls: ['./event-payments.component.css']
})
export class EventPaymentsComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  public payment_title:string = ""

  // parameters
  public payment_list:any = []
  public event_list:any = []
  
  public selected_event:any = []
  public selected_event_id:number = 0
  public selected_event_name:string = ""
  public paid_events_count:number = 0
  public active_events_count:number = 0
  public payment_count:number = 0

  public messageResponse:string = ''
  public msg:string = ''

  // filters
  public periodSelection:boolean = false
  public rangeFilter:boolean = false
  public dateFilter:boolean = false
  public monthFilter:boolean = false
  public yearFilter:boolean = false

  public rangeValidationMessage:boolean = false
  public rangeMessage:string = ""

  public year: number = new Date().getFullYear();
  public selected_year:number = this.year
  public yearValidationMessage:boolean = false

  public month_names:any = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
  public months:any = []  
  public month_name:string = ""

  public filtered_start_date:string = ""
  public filtered_end_date:string = ""
  public filtered_selected_date:string = ""
  public filtered_selected_month:number = new Date().getMonth();
  public filtered_selected_year:number = this.year

  public selected_filter_string:string = ""
  
  // Datatables & dropdown
  public dropdownSettings!: IDropdownSettings

  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  
  public isDtInitialized:boolean = false;
  public dtOptions: any = {};
  public dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private cbfService: CbfService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {  }
  

  ngOnInit(): void {

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

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

    // fetch all payments
    this.getEvents()
    this.getPayments(0, 'life')
  }
     
  // Endpoints Consumption  
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

        this.event_list = eventArray       
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(eventsSubscr);

  }

  getPayments(selected_event_id:number, filter_value:string){

    let year = ''
    let month = ''
    let start_date = ''
    let end_date = ''
    let period_string = ''
    
    if(filter_value == 'life'){
      year = ''
      month = ''
      start_date = ''
      end_date = ''
      period_string = 'lifetime payments'
    } else if(filter_value == 'range'){
      start_date = this.filtered_start_date
      end_date = this.filtered_end_date
      period_string = 'payments between ' + start_date + ' and ' + end_date
    } else if(filter_value == 'monthly'){
      month = this.filtered_selected_month.toString()
      year = this.filtered_selected_year.toString()
      
      period_string = 'payments for ' + this.month_name + ', '+ year
    } else if(filter_value == 'single'){
      start_date = this.filtered_selected_date
      period_string = 'payments for ' + start_date
    } else if(filter_value == 'yearly'){
      year = this.filtered_selected_year.toString()
      period_string = 'payments for the year ' + year
    } else {
      period_string = 'lifetime payments'
    }

    let event_id = selected_event_id
    if(event_id == 0) {
      this.payment_title = "List of all " + period_string
    } else {
      // check period
      this.payment_title = this.selected_event_name + ' ' + period_string
    }

    const paymentSubscr = this.cbfService.getEventPayments(event_id, year, month, start_date, end_date, this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.payment_count = result.total_payments
        this.paid_events_count = result.paid_events 
        this.active_events_count = result.active_events 
        this.payment_list = result.results 

        if(this.payment_count > 0){

          if (this.isDtInitialized) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
                this.dtTrigger.next();
            });
          } else {
              this.isDtInitialized = true;              
              this.dtTrigger.next(this.payment_list)
          }

        }         
        
        this.messageResponse = "Filter successful"
        this.spinner.hide()
        
      },      
      error: (err: HttpErrorResponse) => {
        this.spinner.hide()
        this.messageResponse = err.message
      }
    })

    this.unsubscribe.push(paymentSubscr);

  }

  // modal(s)
  openModal(content:any, size:string) {

    this.messageResponse = ""
    this.periodSelection = false
    
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

  }

  // Select Options
  onItemSelect(item: any) {
    let selected_event = item;

    this.selected_event.push(selected_event)
    this.selected_event_id = selected_event.id
    this.selected_event_name = selected_event.name
  }

  onItemDeSelect(event: any) {

    this.selected_event = []
    this.selected_event_id = 0
    this.selected_event_name = ""
  }

  // select period
  selectPeriod(period: string) {
    if(period == "") {
      this.periodSelection = false
    } else {
      // get type
      this.selected_filter_string = period

      // disable all
      this.rangeFilter = false
      this.dateFilter = false
      this.monthFilter = false
      this.yearFilter = false

      if(this.selected_filter_string == 'range') {
        this.rangeFilter = true
      } else if(this.selected_filter_string == 'single') {
        this.dateFilter = true
      } else if(this.selected_filter_string == 'monthly') {
        this.monthFilter = true
      } else if(this.selected_filter_string == 'yearly') {
        this.yearFilter = true
      } 
      
      this.periodSelection = true
      
    }
  }

  // validate year
  validateYear(value: any) {
    let inputed_year = value;

    if(inputed_year.toString().length == 4){  
      this.yearValidationMessage = false
      this.selected_year = inputed_year  
    } else {
      this.yearValidationMessage = true
    }

  }

  // get start date for range
  getStartRange(st_date: any) {
    this.filtered_start_date = st_date
  }

  // validate date range
  validateRange(end_date: any) {
    
    this.rangeValidationMessage = false
    this.rangeMessage = ""

    this.filtered_end_date = end_date;

    if(this.filtered_start_date == '') {
      this.rangeValidationMessage = true
      this.rangeMessage = "Please enter the start date"

    } else {

      let days:number = 0

      var startDate = new Date(this.filtered_start_date);
      var endDate = new Date(this.filtered_end_date);
    
      var Time = endDate.getTime() - startDate.getTime();
      days = Time / (1000 * 3600 * 24);

      if((days >= 2) && (days <= 12)){

        this.rangeValidationMessage = false;

      } else if(days > 12){

        this.rangeValidationMessage = true;
        this.rangeMessage = "Kindly note, you can only select a range of 12 days maximum"

      } else if(days < 2){
        this.rangeValidationMessage = true;
        this.rangeMessage = "Kindly note, you need to select a range of 2 days minimum"
      }

    }
    
  }

  // Form Actions
  filterPaymentAction(data:any) {

    // event filter
    let event_filter_id:number = 0
    if(this.selected_event_id != 0){
      event_filter_id = this.selected_event_id
    }

    // period filter
    let selected_period = this.selected_filter_string

    if(selected_period == 'range') {
      // get range
      this.filtered_start_date = data.start_date
      this.filtered_end_date = data.end_date

    } else if(selected_period == 'single') {
      this.filtered_selected_date = data.day_selected
    } else if(selected_period == 'monthly') {

      let mon_year = data.month;

      // split month & year  
      let sl_year = mon_year.split("-")[0]  
      let sl_month = mon_year.split("-")[1]

      // get data with dates
      let month_fig_one = sl_month.slice()[0]
      if(month_fig_one == '0') {
        this.filtered_selected_month = sl_month.slice()[1]
      } else {
        this.filtered_selected_month = sl_month
      }
      
      this.filtered_selected_year = sl_year
      this.month_name = this.month_names[this.filtered_selected_month]
      
    } else if(selected_period == 'yearly') {
      this.filtered_selected_year = data.year
    }    

    this.spinner.show()

    // get Payments
    this.getPayments(event_filter_id, selected_period)

    setTimeout(() => {
      this.modalService.dismissAll()
    }, 1800);

  }

}
