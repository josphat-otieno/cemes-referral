import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public accessToken:string = ''
  public user_id:number = 0
  private unsubscribe: Subscription[] = [];

  // parameters
  public assemblies:any = []
  public staffList:any = []
  public memberListing:any = []

  public staffCount:number = 0
  public activeStaffCount:number = 0
  public inactiveStaffCount:number = 0

  public staffModalData:any = []
  public messageResponse:string = ''
  public msg:string = ''

  public validity:boolean = false
  public emailValidationMessage: boolean = false
  public phoneValidationMessage: boolean = false

  public conversionForm: FormGroup | any
  public staffRegistration: FormGroup | any
  public password:string =''
  public passwordValue:string =''

  public memberSelectionStatus:boolean = false
  
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
    this.getStaffList()
  }

  createForm() {
    this.staffRegistration = this.fb.group({
      fullName: ['', [Validators.required ]],
      email: ['', [Validators.required ,  Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(6)] ],
		  assembly: [''],
      phoneNumber: ['', [Validators.required] ],
    })

    this.conversionForm = this.fb.group({
      member: ['', [Validators.required]],     
    })
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

  // validate checkbox
  regMemberChecked (isChecked: boolean) {
    if(isChecked === true){
      this.memberSelectionStatus = true
    } else {
      this.memberSelectionStatus = false
      this.staffRegistration.get('assembly')?.patchValue('')
    }
  }

  // modals
  passwordInput(value:any){

    this.passwordValue = ''
    this.password =value
  }

  toggleEye: boolean = true;
  
  // toggle password
  toggleEyeIcon(inputPassword:any) {
		this.toggleEye = !this.toggleEye;		
		inputPassword.type = inputPassword.type === 'password' ? 'text' : 'password';
	}

  // modal mgt
  openModal(content:any, size:string) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
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
    this.staffModalData = data
  }

  reviewUpdateModal(editStaff:any, staff:any) {
    this.modalService.open(editStaff, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    this.password = ''
    let modalData = staff;
    this.staffModalData = modalData
  
  }
   
  // Endpoints Consumption  
  getAssemblies() {

    const assemblySubscr = this.cbfService.getAssemblies(this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response
        this.assemblies = queryResults.results
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(assemblySubscr);
  }


  getStaffList(){

    const userSubscr = this.cbfService.getStaff(this.accessToken)
    // .map(region_name)
    .subscribe({
      next: (response: any) => {
        let result = response   
        console.log(result)
        this.staffCount = result.count.total
        this.activeStaffCount = result.count.active
        this.inactiveStaffCount = result.count.inactive

        this.staffList = result.results 

        if(this.staffCount > 0){
          this.dtTrigger.next(this.staffList)
        }        
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(userSubscr);

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

  convertAction() {

  }

  saveStaff() {

    const regData:FormData = new FormData()
    regData.append('full_name', this.staffRegistration.get('fullName')?.value)
    regData.append('email', this.staffRegistration.get('email')?.value)
    regData.append('phone_number', this.staffRegistration.get('phoneNumber')?.value)
    regData.append('password', this.staffRegistration.get('password')?.value)
    regData.append('assembly', this.staffRegistration.get('assembly')?.value)
    regData.append('user', this.user_id.toString())

    const regsterSubscr = this.cbfService.registerMember(regData, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let results = response
        
        if(results.status){
          
          this.messageResponse = results.message

          if(results.status == 1){
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);

          } 

        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.msg = 'Something went wrong, please try again'  
        this.messageResponse = this.msg
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
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);

          } else {
            this.messageResponse = response.message
          }
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.messageResponse = 'Something went wrong, please try again'  
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
            
            setTimeout(() => {
              window.location.reload()
            }, 1200);
          } else {
            this.messageResponse = response.message;
          }
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.messageResponse = 'Something went wrong, please try again' 
      }   
    })
    
    this.unsubscribe.push(delSubscr);

  }

}
