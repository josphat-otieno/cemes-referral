import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-business-category',
  templateUrl: './business-category.component.html',
  styleUrls: ['./business-category.component.css']
})
export class BusinessCategoryComponent implements OnInit {
  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public categoryList:any = []
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
  }

  createForm() {
    this.categoryRegistration = this.fb.group({
      category: ['', [Validators.required ]],
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

    const categorySubscr = this.cbfService.getBusinessCategories(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.categoryCount = result.count
        this.categoryList = result.results 

        if(this.categoryCount > 0){
          this.dtTrigger.next(this.categoryList)
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
    regData.append('category', this.categoryRegistration.get('category')?.value)

    const regsterSubscr = this.cbfService.registerBusinessCategory(regData, this.accessToken)

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

  updateCategoryAction(data: any) {

    let modalData = data
    let catId = modalData.id

    const updateData:FormData = new FormData()
    updateData.append('category', modalData.category)
    updateData.append('modified_by', this.user_id.toString())

    const updateSubscr = this.cbfService.updateBusinessCategory(updateData, catId,  this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Category updated successfully'
            
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

  deleteCategoryAction(data: any) {

    let modalData = data
    let catId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_deleted', true.toString())
    delData.append('modified_by', this.user_id.toString())

    const delSubscr = this.cbfService.updateBusinessCategory(delData, catId, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Category deleted successfully'
            
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
