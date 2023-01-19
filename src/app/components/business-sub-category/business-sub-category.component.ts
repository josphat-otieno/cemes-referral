import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-business-sub-category',
  templateUrl: './business-sub-category.component.html',
  styleUrls: ['./business-sub-category.component.css']
})
export class BusinessSubCategoryComponent implements OnInit {
  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public categoryList:any = []
  public subCategoryList:any = []
  public categoryCount:number = 0

  public categoryModalData:any = []
  public messageResponse:string = ''
  public msg:string = ''

  public validity:boolean = false
  public categoryRegistration: FormGroup | any
  
  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private cbfService: CbfService,
    private modalService: NgbModal,
    private fb: FormBuilder
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
    this.getSubCategories()
  }

  createForm() {
    this.categoryRegistration = this.fb.group({
      sub_category_name: ['', [Validators.required ]],
      business_category: ['', [Validators.required ]],
    })
  }

  
  // modals
  openModal(content:any, size:string) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

	}

  reviewModal(content:any, data:any) {
    this.modalService.open(content)
    this.categoryModalData = data
  }
   
  // Endpoints Consumption  
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

  getSubCategories(){

    const categorySubscr = this.cbfService.getBusinessSubCategories(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.categoryCount = result.count
        this.subCategoryList = result.results 

        if(this.categoryCount > 0){
          this.dtTrigger.next(this.subCategoryList)
        }        
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(categorySubscr);

  }

  saveCategory() {

    const regData:FormData = new FormData()
    regData.append('sub_category_name', this.categoryRegistration.get('sub_category_name')?.value)
    regData.append('business_category', this.categoryRegistration.get('business_category')?.value)
    regData.append('modified_by', this.user_id.toString())

    const regsterSubscr = this.cbfService.registerBusinessSubCategory(regData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let results = response
        
        if(results.id){
          
          this.messageResponse = 'Sub-Category created successfully'
            
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

  updateSubCategoryAction(data: any) {

    let modalData = data
    let catId = modalData.id

    const updateData:FormData = new FormData()
    updateData.append('sub_category_name', modalData.name)
    updateData.append('business_category', modalData.categoryId)
    updateData.append('modified_by', this.user_id.toString())

    const updateSubscr = this.cbfService.updateBusinessSubCategory(updateData, catId,  this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Sub-Category updated successfully'
            
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

  deleteSubCategoryAction(data: any) {

    let modalData = data
    let catId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_deleted', true.toString())
    delData.append('modified_by', this.user_id.toString())

    const delSubscr = this.cbfService.updateBusinessSubCategory(delData, catId, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Sub-Category deleted successfully'
            
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
