import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isEmptyObject } from 'jquery';
import { Subject, Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.css']
})
export class CustomFormComponent implements OnInit {
  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];
  public msg:string = ''
  public customForm: FormGroup | any

  formId: any
  customFormName: string = ''
  selectedItems: any = []
  checkedFormItems : any = []
  isChecked: boolean = false


    // parameters
    public customFormLists:any = []
    public customFormsCount:number = 0


    // Datatables
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject<any>();
    messageResponse: string =''
  customModalData: any;
  customFormData: any = []
  
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

  }

  openModal(targetModal:any, data:any) {
    // this.spinner.show()
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });

    let modal_data = data;
    this.formId = modal_data.id
    // console.log(this.formId)
    this.customModalData = modal_data;


    // // this.getFormItems()
    // this.getCustomForm()
    // this.getFormItems()
    // this.spinner.hide()

  }


  addForms(customForm:any) {
    this.modalService.open(customForm, {
      centered: true,
      backdrop: 'static'
    })
  }

  openModalItems(targetModal:any, data:any) {    


    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    
    let modal_data = data;
    // console.log(modal_data)
    this.formId = modal_data.id
    this.customModalData = modal_data
    // this.getCustomForm()
    // this.getCustomFormItems()
    // this.getFormItems()
    
    setTimeout(() => {
      this.customFormData.forEach((x:any) => {
        let id:number = x['id']
        let status = x['ischecked']
       
        if(status === true){
          this.selectedItems.push(id)
        }
  
      })

      console.log(this.selectedItems)
    }, 2000);

  }


    createCustomForm() {
      this.customForm = this.fb.group({
        name: ['', [Validators.required ]],
        description: ['', [Validators.required ]],
      })
    }

       
    // create
    saveCustomForm() {

      const regData:FormData = new FormData()
      regData.append('name', this.customForm.get('name')?.value)
      regData.append('description', this.customForm.get('description')?.value)
  
  
      const regsterSubscr = this.cbfService.createCustomForm  (regData, this.accessToken)
  
      .subscribe({
        next: (response: any) => {
          let results = response
          
          if(results.id){
            
            this.messageResponse = 'Category created successfully'
              
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
  getCustomForms(){

    const customSubscr = this.cbfService.getCustomForms(this.accessToken)
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

  updateCustomForm(data: any) {

    let modalData = data
    let cFormId = modalData.id
  
    const updateData:FormData = new FormData()
    updateData.append('name', modalData.category)
    updateData.append('description', this.user_id.toString())
  
    const updateSubscr = this.cbfService.updateCustomForm( cFormId, updateData, this.accessToken)
  
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
  
  deleteCustomForm(data: any) {
  
    let modalData = data
    let cFormId = modalData.id
  
    const delData:FormData = new FormData()
    // delData.append('is_deleted', true.toString())
    // delData.append('modified_by', this.user_id.toString())
  
    const delSubscr = this.cbfService.deleteCustomForm(cFormId, this.accessToken)
  
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
  

  // assign form items
  assignFormItems() {
    // this.spinner.show();

    if(isEmptyObject(this.selectedItems)){
      // this.spinner.hide();
      this.msg = 'Select at least one item';
      // this.toaster.error(this.msg, 'Caution');
    }

    else{
      
      const uniqueItems = [...new Set(this.selectedItems)]

      let formItems = JSON.stringify(uniqueItems)
      // console.log(uniqueItems)
      // write endpoint backend to add all selected custom form items
      // send custom form id and and array 
      const itemsFormData: FormData = new FormData()
      itemsFormData.append('formItems',formItems )
      itemsFormData.append('cstom_form_id', this.formId)


    const addItemsSubscr = this.cbfService.createCustomFormCustomFormItem(itemsFormData, this.accessToken)

    .subscribe({
      next: (response: any) => {
       
        if(response){
          
          this.messageResponse = 'Form Items  added successfully'
            
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
    
    this.unsubscribe.push(addItemsSubscr);
    }

  }

    // get custom form 
    getCustomForm() {
        const formSubscr = this.cbfService.getCustomForm(1, this.accessToken)
        .subscribe({
          next: (response:any) => {
            let results = response
          },
          error: (e:HttpErrorResponse) =>  {
            this.msg = 'Something went wrong, please try again'  
            this.messageResponse = this.msg
          }   
        })
    }
  


  


  // get custom form items
  // getCustomFormItems() {


  //   this.formOptions = {
  //     pagingType: 'full_numbers',
  //     pageLength: 6,
  //     processing: true
  //   }; 

  //   // Initialize Trigger
  //   this.formTrigger = new Subject()

  //   this.spinner.show()    

  //   let jwt = this.cookieService.get('JTW')
  //   this.jumuishaService.getAccess(jwt).subscribe(resp => {
  //     let access = resp.access
  //     this.formSubscription = this.jumuishaService.getCustomFormsItems(this.churchId, access).subscribe(response => {
  //       let data = response['results'];
  //       // console.log(data)
  //       var customData = JSON.parse(JSON.stringify(data));
  //       // this.customFormData = customData
                  
  //       let itemsArray : any = []
  //       customData.forEach(item => {
  //         let id = item['id']
  //         let title = item['title']
  //         let dataType = item['dataType']
          
         
  //       // get custom custom form together with its associated form item
  //         this.jumuishaService.getCustomFormCustomFormItem_Id(this.formId,id, access).subscribe((itemResp : any) => {

  //           let customresponse: any = itemResp['results']

  //           let ischecked: boolean = false

  //            // check if custom form has form item assigned to it
  //           if(customresponse.length > 0  && customresponse[0]['custom_form_id'] == this.formId){
  //             ischecked = true
  //           }else{
  //             ischecked = false
  //           }
  //           let itemObject = {'id':id,'title': title,'dataType':dataType,'ischecked':ischecked}
  //           itemsArray.push(itemObject)
  //         })
       
  //       })
        
  //       this.customFormData = itemsArray

  //         //  console.log(this.customFormData)

  //         setTimeout(() => {
  //           this.formTrigger.next();
  //           this.spinner.hide();
  //         }, 2000);


  //     }, (error: HttpErrorResponse) => {
  //       this.spinner.hide();
  //       this.msg = "Something went wrong, kindly try again";
  //       this.toaster.warning(this.msg, 'An error occured');
  //     })
  //   })

  // }















}


 

  

