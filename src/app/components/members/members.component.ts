import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ls from 'localstorage-slim';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  public token:string = ''
  public accessToken:string = ''  
  public user_id:number = Number(ls.get('id', {decrypt: true, secret: 43}));
  public MemberRegistration: FormGroup | any;
  public members:any = []
  public pendingMembers:any = []
  public assemblies:any = []
  private unsubscribe: Subscription[] = [];
  private msg:string = ''  
  public password:string =''
  public passwordValue:string =''

  // response
  public messageResponse:string = ''

  // parameters
  public pendingMemberCount:number = 0
  public memberCount:number = 0
  public memberModalData:any = []

  // validation parameters
  public validity:boolean = false
  public phoneValidationMessage:boolean = false
  public emailValidationMessage:boolean = false

  constructor(
    private fb: FormBuilder, 
    private cookieService: CookieService,   
    private toaster: ToastService,
    private modalService: NgbModal,
    private cbfService: CbfService
  ) {
    this.createForm();
  }
  
  createForm() {
    this.MemberRegistration = this.fb.group({
      fullName: ['', [Validators.required ]],
      email: ['', [Validators.required ,  Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(6)] ],
		  assembly: ['', [Validators.required] ],
      phoneNumber: ['', [Validators.required] ],
    })
  }
  

  ngOnInit(): void {
    
    this.token =  this.cookieService.get("JTW");
    this.getAccessToken()
  }
  
  passwordInput(value:any){

    this.passwordValue = ''
    this.password =value
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

  toggleEye: boolean = true;
  
  // toggle password
  toggleEyeIcon(inputPassword:any) {
		this.toggleEye = !this.toggleEye;		
		inputPassword.type = inputPassword.type === 'password' ? 'text' : 'password';
	}

  // modal mgt
  openModal(content:any) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

	}

  generatePassword() {
    function getRandomString(length:any) {
      var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var result = '';
      for ( var i = 0; i < length; i++ ) {
          result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      return result;
    }
  
    this.passwordValue = getRandomString(8);
  }

  reviewModal(content:any, data:any) {
    this.modalService.open(content)
    this.memberModalData = data
  }

  reviewUpdateModal(editStaff:any, staff:any) {
    this.modalService.open(editStaff, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    this.password = ''
    let modalData = staff;
    this.memberModalData = modalData
  
  }
 
  // Endpoints Consumption
  getAccessToken(){

    const accessSubscr = this.cbfService.getAccess(this.token)
    // .map(region_name)
    .subscribe({
      next: (response: any) => {
        let result = response 
        this.accessToken = result.access
        
        this.getAssemblies(this.accessToken)                
        this.getMembers(this.accessToken)
        this.getPendingMembers(this.accessToken)
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(accessSubscr);

  }

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

  getMembers(access: string) {
    let acessTkString = access
    let assembly = 0

    const memberSubscr = this.cbfService.getAllMembers(assembly, acessTkString)

    .subscribe({
      next: (response: any) => {
        let queryResults = response

        this.memberCount = queryResults.count
        this.members = queryResults.results
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(memberSubscr);

  }

  getPendingMembers(access: string) {
    let acessTkString = access
    let assembly = 0

    const memberSubscr = this.cbfService.getPendingMembers(assembly, acessTkString)

    .subscribe({
      next: (response: any) => {
        let queryResults = response

        this.pendingMemberCount = queryResults.count
        this.pendingMembers = queryResults.results
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(memberSubscr);

  }

  saveMember() {

    const regData:FormData = new FormData()
    regData.append('full_name', this.MemberRegistration.get('fullName')?.value)
    regData.append('email', this.MemberRegistration.get('email')?.value)
    regData.append('phone_number', this.MemberRegistration.get('phoneNumber')?.value)
    regData.append('password', this.MemberRegistration.get('password')?.value)
    regData.append('assembly', this.MemberRegistration.get('assembly')?.value)
    regData.append('user', this.user_id.toString())

    const regsterSubscr = this.cbfService.registerMember(regData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let results = response
        
        if(results.status){
          
          this.messageResponse = results.message

          if(results.status == 1){
            this.toaster.show(results.message, { classname: 'bg-success text-light', delay: 10000 });
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);

          } else {
            this.toaster.show(results.message, { classname: 'bg-warning text-light', delay: 10000 });
          }
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.msg = 'Something went wrong, please try again'  
        this.toaster.show(this.msg, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(regsterSubscr);
  }

  updateMember(data: any) {

    let modalData = data

    const updateData:FormData = new FormData()
    updateData.append('full_name', modalData.full_name)
    updateData.append('email', modalData.email)
    updateData.append('phone_number', modalData.phone_number)

    if(this.passwordValue != '' && modalData.password != ''){
      updateData.append('password', modalData.password)
    }

    updateData.append('assembly', modalData.assemblyUpdate)
    updateData.append('businessOwner', modalData.id)
    updateData.append('user', this.user_id.toString())

    const regsterSubscr = this.cbfService.updateMember(updateData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.status){
          
          this.messageResponse = response.message

          if(response.status == 1){

            this.toaster.show(response.message, { classname: 'bg-success text-light', delay: 10000 });
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);
          } else {
            this.toaster.show(response.message, { classname: 'bg-warning text-light', delay: 10000 });
          }
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.messageResponse = 'Something went wrong, please try again'  
        this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(regsterSubscr);

  }

  deleteMemberAction(data: any) {

    let modalData = data

    const delData:FormData = new FormData()
    delData.append('businessOwner', modalData.id)
    delData.append('user', this.user_id.toString())

    const delSubscr = this.cbfService.deleteMember(delData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.status){
          this.messageResponse = response.message

          if(response.status == 1){
            this.toaster.show(response.message, { classname: 'bg-success text-light', delay: 10000 });
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);
          } else {
            this.toaster.show(response.message, { classname: 'bg-warning text-light', delay: 10000 });
          }
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
        this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(delSubscr);

  }

  approveMemberAction(data: any) {

    let modalData = data

    const apprvData:FormData = new FormData()
    apprvData.append('type', 'approve')
    apprvData.append('businessOwner', modalData.id)
    apprvData.append('user', this.user_id.toString())

    const apprvSubscr = this.cbfService.verifyMember(apprvData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.status){
          this.messageResponse = response.message

          if(response.status == 1){
            this.toaster.show(response.message, { classname: 'bg-success text-light', delay: 10000 });
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);
          } else {
            this.toaster.show(response.message, { classname: 'bg-warning text-light', delay: 10000 });
          }
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.msg = 'Something went wrong, please try again'  
        this.messageResponse = this.msg
        this.toaster.show(this.msg, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(apprvSubscr);

  }

  revokeMemberAction(data: any) {

    let modalData = data

    const apprvData:FormData = new FormData()
    apprvData.append('type', 'reject')
    apprvData.append('businessOwner', modalData.id)
    apprvData.append('user', this.user_id.toString())

    const apprvSubscr = this.cbfService.verifyMember(apprvData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.status){
          this.messageResponse = response.message

          if(response.status == 1){
            this.toaster.show(response.message, { classname: 'bg-success text-light', delay: 10000 });
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);
          } else {
            this.toaster.show(response.message, { classname: 'bg-warning text-light', delay: 10000 });
          }
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.messageResponse = 'Something went wrong, please try again'  
        this.toaster.show(this.messageResponse, { classname: 'bg-warning text-light', delay: 10000 });
      }   
    })
    
    this.unsubscribe.push(apprvSubscr);

  }
  
  
}
