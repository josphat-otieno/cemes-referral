import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.css']
})
export class AppUsersComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  public appUsers:any = []
  private unsubscribe: Subscription[] = [];

  // parameters
  public userCount:number = 0
  public userModalData:any = []
  public messageResponse:string = ''
  public msg:string = ''
  public assemblies:any = []
  public selectedAssembly:number = 0

  public validity:boolean = false
  public conversionValidity:boolean = false
  public emailValidationMessage: boolean = false
  public phoneValidationMessage: boolean = false
  
  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private cbfService: CbfService,
    private modalService: NgbModal
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
    this.getAssemblies(this.accessToken)
    this.getAppUserList()
  }

  //Validate Phone Number
  validatePhone(value: string) {
    let phoneNumber = value;
    if((phoneNumber.length > 10) || (phoneNumber.length < 10) && (phoneNumber.charAt(0) != '0')){
      this.phoneValidationMessage = true;
      this.validity = true;
    } else {
      this.phoneValidationMessage = false;
      this.validity = false;
    }
  }

  //validate Email
  validateEmail(value: string) {
    let email = value;
    if(!email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")){
      this.emailValidationMessage = true;
      this.validity = true;
    } else {
      this.emailValidationMessage = false;
      this.validity = false;
    }
  }
   
  // Endpoints Consumption  
  getAssemblies(accessTk: string) {

    const assemblySubscr = this.cbfService.getAssemblies(accessTk)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.assemblies = queryResults.results
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(assemblySubscr);
  }


  getAppUserList(){

    const userSubscr = this.cbfService.getAppUsers(this.accessToken)
    // .map(region_name)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.userCount = result.count  
        this.appUsers = result.results 

        if(this.userCount > 0){        
          this.dtTrigger.next(this.appUsers)
        }
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(userSubscr);

  }

  reviewModal(content:any, data:any) {
    this.modalService.open(content)
    this.userModalData = data
  }

  conversionModal(modalName:any, appUser:any) {
    this.modalService.open(modalName, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    let modalData = appUser;
    this.userModalData = modalData
  
  }

  activateUserAction(data: any) {
    
    let modalData = data
   
    const apprvData:FormData = new FormData()
    apprvData.append('type', 'activate')
    apprvData.append('userId', modalData.id)
    apprvData.append('user', this.user_id.toString())

    const activSubscr = this.cbfService.verifyAppUser(apprvData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.status){
          this.messageResponse = response.message

          if(response.status == 1){
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);

          } 
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.messageResponse = 'Something went wrong, please try again'
      }   
    })
    
    this.unsubscribe.push(activSubscr);
  }

  deactivateUserAction(data: any) {
    
    let modalData = data

    const apprvData:FormData = new FormData()
    apprvData.append('type', 'deactivate')
    apprvData.append('userId', modalData.id)
    apprvData.append('user', this.user_id.toString())

    const activSubscr = this.cbfService.verifyAppUser(apprvData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.status){
          this.messageResponse = response.message

          if(response.status == 1){
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);

          } 
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.messageResponse = 'Something went wrong, please try again'
      }   
    })
    
    this.unsubscribe.push(activSubscr);
  }

  selectAssembly(assemblyId:any) {
    if(assemblyId != 0){
      this.conversionValidity = true
      this.selectedAssembly = assemblyId
    } else {
      this.conversionValidity = false
    }
    
  }

  convertMemberAction(data: any) {

    if(this.selectedAssembly != 0){      

      let modalData = data
      let uniqueMemberIdentity = modalData.uniqueMemberId

      const updateData:FormData = new FormData()
      updateData.append('type', 'convert')
      updateData.append('assembly', this.selectedAssembly.toString())
      updateData.append('user', modalData.businessOwner)
      updateData.append('national_id', uniqueMemberIdentity)
      updateData.append('currentUser', this.user_id.toString())

      const regsterSubscr = this.cbfService.convertAppUser(updateData, this.accessToken)

      .subscribe({
        next: (response: any) => {
          
          if(response.status){
            
            this.messageResponse = response.message

            if(response.status == 1){
              setTimeout(() => {
                window.location.reload()
              }, 1200);
            } 
            
          }
          
        },
        error: (e:HttpErrorResponse) =>  {
          console.log(e)
          this.messageResponse = 'Something went wrong, please try again'  
        }   
      })
      
      this.unsubscribe.push(regsterSubscr);

    } else {
      this.conversionValidity = false
      this.messageResponse = 'Please select a valid assembly'
    }  

  }

}
