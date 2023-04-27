import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-custom-form-items',
  templateUrl: './custom-form-items.component.html',
  styleUrls: ['./custom-form-items.component.css']
})
export class CustomFormItemsComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];
  public msg:string = ''
  public customForm: FormGroup | any


    // parameters
    public customFormLists:any = []
    public customFormsCount:number = 0


    // Datatables
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject<any>();
    messageResponse: string =''
    choice: boolean = false;
    editChoice: boolean = false;
  customItemModalData: any;

  constructor(
    private cbfService: CbfService,
    private modalService: NgbModal,
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

  this.accessToken = this.cbfService.AccessToken
  this.user_id = Number(this.cbfService.currentUserValue)

  this.customFormItem()
  this.getCustomFormItems()

  }

    // modals

    openModal(targetModal:any, data:any) {
      this.modalService.open(targetModal, {
        centered: true,
        backdrop: 'static'
      });
      let modal_data = data;
      if(modal_data.dataType == 'choice'){
        this.editChoice = true
      }else{
        this.editChoice = false
      }
      this.customItemModalData = modal_data;
    }
  
    createItemModal(formItem:any ){
      this.modalService.open(formItem, {
        centered: true,
        backdrop: 'static'
      })
  
    }
  

    customFormItem() {
      this.customForm = this.fb.group({
       
        title: [''],
        user: [this.user_id],
        hint: [''],
        dataType: [''],
        value : [''],
      })
    }


    selector(val: string) {

      if (val == 'choice') {
        this.choice = true;
      } else {
        this.choice = false;
      }
    }
  
    selectorEdit(val: string) {
      if (val == 'choice') {
        this.editChoice = true;
      } else {
        this.editChoice = false;
      }
    }
  
       
    // create
    saveCustomFormItem() {

      const regData:FormData = new FormData()
      regData.append('title', this.customForm.get('title')?.value)
      regData.append('dataType', this.customForm.get('dataType')?.value)
      regData.append('value', this.customForm.get('value')?.value)
      regData.append('hint', this.customForm.get('hint')?.value)
      regData.append('user', this.customForm.get('user')?.value)

  
  
  
      const regsterSubscr = this.cbfService.createCustomCustomFormItem(regData, this.accessToken)
  
      .subscribe({
        next: (response: any) => {
          let results = response
          
          if(results.id){
            
            this.messageResponse = 'Custom Form Item created successfully'
              
            setTimeout(() => {
              window.location.reload()
            }, 1200);
  
          }
          
        },
        error: (e:HttpErrorResponse) =>  {
          this.msg = 'Something went wrong, please try again'  
          this.messageResponse = this.msg
        }   
      })
      
      this.unsubscribe.push(regsterSubscr);
    }

    // get custom forms
      // Endpoints Consumption  
  getCustomFormItems(){

    const customSubscr = this.cbfService.getCustomFormsItems(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.customFormsCount = result.count
        this.customFormLists = result.results 

        if(this.customFormsCount > 0){
          this.dtTrigger.next(this.customFormLists)
        }        
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(customSubscr);

  }

  updateCustomFormItem(data: any) {

    let modalData = data
    let cFormId = modalData.id
  
    const updateData:FormData = new FormData()

    updateData.append('title', this.customForm.get('title')?.value)
    updateData.append('dataType', this.customForm.get('dataType')?.value)
    updateData.append('value', this.customForm.get('value')?.value)
    updateData.append('hint', this.customForm.get('hint')?.value)
    updateData.append('user', this.customForm.get('user')?.value)

    const updateSubscr = this.cbfService.updateCustomFormItem( cFormId, updateData, this.accessToken)
  
    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Custom Form  updated successfully'
            
          setTimeout(() => {
            window.location.reload()
          }, 1200);
  
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.messageResponse = 'Something went wrong, please try again'  
      }   
    })
    
    this.unsubscribe.push(updateSubscr);
  
  }
  
  deleteCustomFormItem(data: any) {
  
    let modalData = data
    let cFormId = modalData.id
  
    // const delData:FormData = new FormData()
 
    const delSubscr = this.cbfService.deleteCustomFormItem(cFormId, this.accessToken)
  
    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Custom Form  deleted successfully'
            
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
