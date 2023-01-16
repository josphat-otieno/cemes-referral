import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
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

  constructor(
    private cbfService: CbfService,
    private modalService: NgbModal
  ) {  }
  

  ngOnInit(): void {
    this.accessToken = this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)
    this.getAppUserList()
  }
   
  // Endpoints Consumption
  getAppUserList(){

    const userSubscr = this.cbfService.getAppUsers(this.accessToken)
    // .map(region_name)
    .subscribe({
      next: (response: any) => {
        let result = response   
        this.userCount = result.count  
        this.appUsers = result.results  
        
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


}
