import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public categoryList:any = []
  public forumList:any = []
  public forumCount:number = 0

  public forumModalData:any = []
  public messageResponse:string = ''
  public msg:string = ''

  public validity:boolean = false
  public forumRegistration: FormGroup | any
  
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
    this.getForumList()
  }

  createForm() {
    this.forumRegistration = this.fb.group({
      name: ['', [Validators.required ]],
      description: ['', [Validators.required ]],
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
    this.forumModalData = data

    console.log(data)
  }
   
  // Endpoints Consumption  
  getCategories(){

    const categorySubscr = this.cbfService.getActiveForumCategories(this.accessToken)
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

  getForumList(){

    const categorySubscr = this.cbfService.getForumListing(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.forumCount = result.count
        this.forumList = result.results 

        if(this.forumCount > 0){
          this.dtTrigger.next(this.forumList)
        }        
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(categorySubscr);

  }

  saveForum() {

    const regData:FormData = new FormData()
    regData.append('name', this.forumRegistration.get('name')?.value)
    regData.append('description', this.forumRegistration.get('description')?.value)
    regData.append('category', this.forumRegistration.get('category')?.value)
    regData.append('created_by', this.user_id.toString())
    regData.append('modified_by', this.user_id.toString())

    const regsterSubscr = this.cbfService.registerForum(regData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let results = response
        
        if(results.id){
          
          this.messageResponse = 'Forum created successfully'
            
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

  updateAction(data: any) {

    let modalData = data
    let ForumId = modalData.id

    const updateData:FormData = new FormData()
    updateData.append('name', modalData.name)
    updateData.append('description', modalData.description)
    updateData.append('category', modalData.categoryId)
    updateData.append('modified_by', this.user_id.toString())

    const updateSubscr = this.cbfService.updateForum(updateData, ForumId,  this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Forum updated successfully'
            
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

  deleteAction(data: any) {

    let modalData = data
    let ForumId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_deleted', true.toString())
    delData.append('modified_by', this.user_id.toString())

    const delSubscr = this.cbfService.updateForum(delData, ForumId, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Forum deleted successfully'
            
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
