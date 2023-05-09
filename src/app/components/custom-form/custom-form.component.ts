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
  public accessToken: string = ''
  public user_id: number = 0
  private unsubscribe: Subscription[] = [];
  public msg: string = ''
  public customForm: FormGroup | any

  // messages
  public messageResponse:string = ""
  public alertResponse:string = ""

  formId: any
  customFormName: string = ''
  selectedItems: any = []
  checkedFormItems: any = []
  isChecked: boolean = false
  customFormItems:any = []
  items_count:number = 0


  // parameters
  public customFormLists: any = []
  public customFormsCount: number = 0

  customFormItemData:any = []


  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  formOptions: any = {};
  formTrigger: Subject<any> = new Subject<any>();

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

    this.formOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,

    };

    this.accessToken = this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)

    this.createCustomForm()
    this.getCustomForms()

  }

  openModal(targetModal: any, data: any) {
    // this.spinner.show()
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });

    let modal_data = data;
    this.formId = modal_data.id
    // console.log(this.formId)
    this.customModalData = modal_data;

    this.customFormItems = this.customModalData.form_items
    console.log(this.customFormItems)
    this.items_count=this.customFormItems.length;


    // // this.getFormItems()
    // this.getCustomForm()
    // this.getFormItems()
    // this.spinner.hide()

  }


  selectItems(id: string, checkedStatus: any) {

    let itemId:number = parseInt(id);
    
    if(checkedStatus.checked === false){
      
      const index = this.selectedItems.indexOf(itemId);
      if (index > -1) { 
        this.selectedItems.splice(index, 1);
      }
    } else {
      this.selectedItems.push(itemId);
    }

  }


  addForms(customForm: any) {
    this.modalService.open(customForm, {
      centered: true,
      backdrop: 'static'
    })
  }

  openModalItems(targetModal: any, data: any, ) {

    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    let modal_data = data;
    console.log(modal_data)
    // console.log(modal_data)
    this.formId = modal_data.id
    this.customModalData = modal_data



    this.getCustomFormItems()
    // this.getFormItems()

    setTimeout(() => {
      this.customFormData.forEach((x: any) => {
        let id: number = x['id']
        let status = x['ischecked']

        if (status === true) {
          this.selectedItems.push(id)
        }

      })

      console.log(this.selectedItems)
    }, 2000);

  }


  createCustomForm() {
    this.customForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      user:[this.user_id],
    })
  }


  // create
  saveCustomForm() {
    console.log(this.customForm.value)

    const regData: FormData = new FormData()
    regData.append('name', this.customForm.get('name')?.value)
    regData.append('description', this.customForm.get('description')?.value)
    regData.append('user', this.customForm.get('user')?.value)




    const regsterSubscr = this.cbfService.createCustomForm(regData, this.accessToken)

      .subscribe({
        next: (response: any) => {
          let results = response

          if (results.id) {

            this.messageResponse = 'Custom Form created successfully'

            setTimeout(() => {
              window.location.reload()
            }, 1200);

          }

        },
        error: (e: HttpErrorResponse) => {
          this.msg = 'Something went wrong, please try again'
          this.messageResponse = this.msg
        }
      })

    this.unsubscribe.push(regsterSubscr);
  }

  // get custom forms
  // Endpoints Consumption  
  getCustomForms() {

    const customSubscr = this.cbfService.getForms(this.accessToken)
      .subscribe({
        next: (response: any) => {
          let result = response
          console.log(result)
          this.customFormsCount = result.count
          this.customFormLists = result.results

          if (this.customFormsCount > 0) {
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

    const updateData: FormData = new FormData()
    updateData.append('name', modalData.name)
    updateData.append('description', modalData.description)

    const updateSubscr = this.cbfService.updateCustomForm(cFormId, updateData, this.accessToken)

      .subscribe({
        next: (response: any) => {

          if (response.id) {

            this.messageResponse = 'Custom Form updated successfully'

            setTimeout(() => {
              window.location.reload()
            }, 1200);

          }

        },
        error: (e: HttpErrorResponse) => {
          this.alertResponse = 'Something went wrong, please try again'
        }
      })

    this.unsubscribe.push(updateSubscr);

  }

  deleteCustomForm(data: any) {

    let modalData = data
    let cFormId = modalData.id

    const delData: FormData = new FormData()
    // delData.append('is_deleted', true.toString())
    // delData.append('modified_by', this.user_id.toString())

    const delSubscr = this.cbfService.deleteCustomForm(cFormId, this.accessToken)

      .subscribe({
        next: (response: any) => {

          if (response.id) {

            this.messageResponse = 'Custom Form  deleted successfully'

            setTimeout(() => {
              window.location.reload()
            }, 1200);

          }

        },
        error: (e: HttpErrorResponse) => {
          this.alertResponse = 'Something went wrong, please try again'
        }
      })

    this.unsubscribe.push(delSubscr);

  }


  // assign form items
  assignFormItems() {
    // this.spinner.show();

    if (isEmptyObject(this.selectedItems)) {
      // this.spinner.hide();
      this.msg = 'Select at least one item';
      // this.toaster.error(this.msg, 'Caution');
    }

    else {

      const uniqueItems = [...new Set(this.selectedItems)]

      let formItems = JSON.stringify(uniqueItems)
      // console.log(uniqueItems)
      // write endpoint backend to add all selected custom form items
      // send custom form id and and array 
      const itemsFormData: FormData = new FormData()
      itemsFormData.append('formItems', formItems)
      itemsFormData.append('cstom_form_id', this.formId)


      const addItemsSubscr = this.cbfService.addFormItems(itemsFormData, this.accessToken)

        .subscribe({
          next: (response: any) => {

            if (response) {

              this.messageResponse = 'Form Items  added successfully'

              setTimeout(() => {
                window.location.reload()
              }, 1200);

            }

          },
          error: (e: HttpErrorResponse) => {
            this.msg = 'Something went wrong, please try again'
            this.alertResponse = this.msg
          }
        })

      this.unsubscribe.push(addItemsSubscr);
    }

  }

  // get custom form 
  getCustomForm() {
    const formSubscr = this.cbfService.getCustomForm(1, this.accessToken)
      .subscribe({
        next: (response: any) => {
          let results = response
        },
        error: (e: HttpErrorResponse) => {
          this.msg = 'Something went wrong, please try again'
          this.alertResponse = this.msg
        }
      })
  }




// get custom form items

getCustomFormItems(){

  this.formOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,

  };
    const formItemSubscr = this.cbfService.formItems(this.formId, this.accessToken)
    .subscribe({
      next:(response:any) => {
        let results = response
        this.customFormItemData = results
        
      },
      error: (e: HttpErrorResponse) => {
        this.msg = 'Something went wrong, please try again'
        this.alertResponse = this.msg
      }
    })
    this.unsubscribe.push(formItemSubscr);
}















}






