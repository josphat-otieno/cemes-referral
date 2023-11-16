import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-membership-tiers',
  templateUrl: './membership-tiers.component.html',
  styleUrls: ['./membership-tiers.component.css']
})
export class MembershipTiersComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public assemblyList:any = []
  public assemblyCount:number = 0

  public assemblyModalData:any = []
  public messageResponse:string = ''
  public msg:string = ''

  public validity:boolean = false
  public assemblyRegistration: FormGroup | any
  
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
    this.getAssemblies()
  }

  createForm() {
    this.assemblyRegistration = this.fb.group({
      assemblyName: ['', [Validators.required ]],
      location: ['', [Validators.required]],
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
    this.assemblyModalData = data
  }
   
  // Endpoints Consumption  
  getAssemblies(){

    const assemblySubscr = this.cbfService.getAssemblies(this.accessToken)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.assemblyCount = result.count
        this.assemblyList = result.results 

        if(this.assemblyCount > 0){
          this.dtTrigger.next(this.assemblyList)
        }        
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(assemblySubscr);

  }

  saveAssembly() {

    const regData:FormData = new FormData()
    regData.append('name', this.assemblyRegistration.get('assemblyName')?.value)
    regData.append('physical_location', this.assemblyRegistration.get('location')?.value)
    regData.append('modified_by', this.user_id.toString())

    const regsterSubscr = this.cbfService.registerAssembly(regData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let results = response
        
        if(results.id){
          
          this.messageResponse = 'Assembly created successfully'
            
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

  updateAssemblyAction(data: any) {

    let modalData = data
    let assemblyId = modalData.id

    const updateData:FormData = new FormData()
    updateData.append('name', modalData.name)
    updateData.append('physical_location', modalData.location)
    updateData.append('modified_by', this.user_id.toString())

    const updateSubscr = this.cbfService.updateAssembly(updateData, assemblyId,  this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Assembly updated successfully'
            
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

  deleteAssemblyAction(data: any) {

    let modalData = data
    let assemblyId = modalData.id

    const delData:FormData = new FormData()
    delData.append('is_deleted', true.toString())
    delData.append('modified_by', this.user_id.toString())

    const delSubscr = this.cbfService.updateAssembly(delData, assemblyId, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
          
          this.messageResponse = 'Assembly deleted successfully'
            
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
