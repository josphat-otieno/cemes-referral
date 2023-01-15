import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.css']
})
export class AppUsersComponent implements OnInit {

  public token:string = ''
  public accessToken:string = ''
  public MemberRegistration: FormGroup | any;
  public members:any = []
  public assemblies:any = []
  private unsubscribe: Subscription[] = [];
  private msg:string = ''  
  public password:string =''
  public passwordValue:string =''

  // parameters
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
    this.getAssemblies()
    
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
        console.log(result)
        this.accessToken = result.access     
        
        
        this.getMembers(this.accessToken)
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(accessSubscr);

  }

  getAssemblies() {
    this.assemblies = [{'id':1, 'name':'CITAM Karen'}]
  }

  getMembers(access: string) {
    let acessTkString = access

    const memberSubscr = this.cbfService.getAllMembers(acessTkString)

    .subscribe({
      next: (response: any) => {
        let queryResults = response

        this.memberCount = queryResults.count
        this.members = queryResults.results
        console.log(queryResults)
        // this.router.navigate([this.returnUrl]);

        
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
    regData.append('is_staff', false.toString())
    regData.append('is_member', true.toString())
    regData.append('is_verified', true.toString())

    const regsterSubscr = this.cbfService.createUser(regData)

    .subscribe({
      next: (response: any) => {
        let results = response
        
        if(results.counter){
          this.toaster.show('Member created successfully', { classname: 'bg-success text-light', delay: 10000 });

          setTimeout(() => {
            window.location.reload
          }, 1200);
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

  }

}
