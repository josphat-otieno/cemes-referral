import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { ActivatedRoute, Router } from '@angular/router';
import ls from 'localstorage-slim';
import { isEmptyObject } from 'jquery';

@Component({
  selector: 'app-forum-management',
  templateUrl: './forum-management.component.html',
  styleUrls: ['./forum-management.component.css']
})
export class ForumManagementComponent implements OnInit {

  public accessToken:string = ''  
  public user_id:number = 0

  public businessCategories:any = []
  public businessOwners:any = []
  private unsubscribe: Subscription[] = [];
  public password:string =''
  public passwordValue:string =''

  // response
  public messageResponse:string = ''
  public alertResponse:string = ''

  // parameters
  public selectedForum:number = 0 
  public forumName:string = ''
  public usersListing:any = []
  public memberListing:any = []
  public selectedUsers:any = []
  
  public adminCount:number = 0
  public userCount:number = 0
  public memberCount:number = 0

  public loading:boolean = false

  public memberModalData:any = []

  // validation parameters
  public validity:boolean = false

  // Datatables
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  mtOptions: any = {};
  mtTrigger: Subject<any> = new Subject<any>();

  constructor( 
    private router: Router,  
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private cbfService: CbfService
  ) { }

  ngOnInit(): void {
    
    // datatable
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    this.mtOptions = {
      pagingType: 'full_numbers',
      pageLength: 6,
      processing: true
    };

    this.activatedRoute.queryParams.subscribe(params => {
      const fpdVal = params['fpd'];  
      let encrypted_id = ls.get('fpd')

      if(isEmptyObject(fpdVal)){

        ls.remove('fpd')
        this.router.navigate(['/admin/forum'])
        
      } else {

        // check if they're same
        if(fpdVal == encrypted_id){
          let decryptedId = ls.get('fpd', {decrypt: true, secret: 43});         
          this.selectedForum = Number(decryptedId);
        } else {
          ls.remove('fpd')
          this.router.navigate(['/admin/forum'])
        }   
        
        this.accessToken =  this.cbfService.AccessToken
        this.user_id = Number(this.cbfService.currentUserValue)
        
        // fetch Members
        this.getForumDetail()
        this.getNonMembers()
        this.getMembers()
        this.getAdmins()

      }
      
    });

  }

  // modal mgt
  openModal(content:any, size:any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

	}

  reviewModal(content:any, data:any) {
    this.modalService.open(content)
    this.memberModalData = data
  }

  // Endpoints Consumption
  
  memSelect(event:any, id: any){
    let isChecked = event.target.checked
    let memberId = id;  

    if(isChecked){
      this.selectedUsers.push(memberId);
    } else {
      const index: number = this.selectedUsers.indexOf(memberId);
      if (index !== -1) {
        this.selectedUsers.splice(index, 1);
      } 
    }
   
  }
 
  getNonMembers() {

    let forumId = this.selectedForum
    let verificationStatus = false

    const nonMemSubscr = this.cbfService.getForumUsers(forumId, verificationStatus, this.accessToken)

    .subscribe({
      next: (response: any) => {

        let queryResults = response
        this.userCount = queryResults.count
        this.usersListing = queryResults.results

        if(this.userCount > 0){
          this.mtTrigger.next(this.usersListing)
        }
        
      },
      error: (e:HttpErrorResponse) =>  this.alertResponse = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(nonMemSubscr);

  }

  getForumDetail() {

    let forumId = this.selectedForum

    const frmSubscr = this.cbfService.getForumDetails(forumId, this.accessToken)

    .subscribe({
      next: (response: any) => {

        let queryResults = response
        this.forumName = queryResults.name
        
      },
      error: (e:HttpErrorResponse) =>  this.alertResponse = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(frmSubscr);

  }

  getMembers() {

    let forumId = this.selectedForum
    let verificationStatus = true

    const MemSubscr = this.cbfService.getForumUsers(forumId, verificationStatus, this.accessToken)

    .subscribe({
      next: (response: any) => {

        let queryResults = response
        this.memberCount = queryResults.count
        this.memberListing = queryResults.results

        if(this.memberCount > 0){
          this.dtTrigger.next(this.memberListing)
        }
        
      },
      error: (e:HttpErrorResponse) =>  this.alertResponse = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(MemSubscr);

  }

  getAdmins() {

    let forumId = this.selectedForum
    let adminStatus = true
    let verificationStatus = true

    const AdminSubscr = this.cbfService.getForumMembers(forumId, adminStatus, verificationStatus, this.accessToken)

    .subscribe({
      next: (response: any) => {

        let queryResults = response
        this.adminCount = queryResults.count
        
      },
      error: (e:HttpErrorResponse) =>  this.alertResponse = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(AdminSubscr);

  }

  assignMembers() {
    
    let CheckedMembers = this.selectedUsers;

    if(isEmptyObject(this.selectedUsers)){
      this.alertResponse = 'Select at least one user';
    } else {

      this.loading = true
      
      let successCount = 0;
      CheckedMembers.forEach((x:any) => {

        let memberId = x;

        const memberFormData:FormData = new FormData()
        memberFormData.append('forum', this.selectedForum.toString())
        memberFormData.append('user', memberId)
        memberFormData.append('created_by', this.user_id.toString())

        const MemSubscr = this.cbfService.saveForumMember(memberFormData, this.accessToken)
        .subscribe({
          next: (response: any) => {

            if(response.id){
              successCount = successCount + 1;

              if(successCount == CheckedMembers.length){
        
                this.loading = false
                this.messageResponse = successCount + ' member(s) successfully sent a joining request'
                    
                setTimeout(() => {
                  window.location.reload()
                }, 1200);
        
              } 
            }
            
          },
          error: (e:HttpErrorResponse) =>  this.alertResponse = 'Something went wrong, please try again'     
        })
        
        this.unsubscribe.push(MemSubscr);
        
      })

    }

  }

  revokeMemberAction(data: any) {

    let forumMemberId = data.id

    const revokSubscr = this.cbfService.revokeForumMember(forumMemberId, this.accessToken)
    .subscribe({
      next: (response: any) => {

        this.messageResponse = 'Member successfully removed'
          
        setTimeout(() => {
          window.location.reload()
        }, 1200);
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.alertResponse = 'Something went wrong, please try again' 
      }   
    })
    
    this.unsubscribe.push(revokSubscr);

  }
  
  ngOnDestroy() {
    this.dtTrigger.unsubscribe()
    this.mtTrigger.unsubscribe()
  }
   
}
