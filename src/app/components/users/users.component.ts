import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
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
  public pendingStaffList:any = []
  public memberListing:any = []

  public pendingStaffCount:number = 0
  public staffCount:number = 0
  public activeStaffCount:number = 0
  public inactiveStaffCount:number = 0

  public staffModalData:any = []
  public messageResponse:string = ''
  public msg:string = ''

  public validity:boolean = false
  public conversionFormValidity:boolean = false
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

  ptOptions: any = {};
  ptTrigger: Subject<any> = new Subject<any>();

  // Multi Select
  public selectedItems = [];
  public dropdownSettings:IDropdownSettings = {};
  public membersArray:any = []
  public selectedMember:number = 0

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
     this.ptOptions = {
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

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };  

    this.accessToken = this.cbfService.AccessToken
    this.user_id = Number(this.cbfService.currentUserValue)
    this.createForm()
    this.getAssemblies()
    this.getStaffList()
    this.getPendingStaffList()
    this.getMembers()
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
  onItemSelect(memberDetail: any) {

    this.selectedMember = memberDetail.id
    if(this.selectedMember != 0){
      this.conversionFormValidity = true
    } else {
      this.conversionFormValidity = false
    }
  }

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

    const userSubscr = this.cbfService.getStaff('approved', this.accessToken)
    // .map(region_name)
    .subscribe({
      next: (response: any) => {
        let result = response  
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

  getPendingStaffList(){

    const userPendingSubscr = this.cbfService.getStaff('pending', this.accessToken)
    // .map(region_name)
    .subscribe({
      next: (response: any) => {
        let result = response  
        this.pendingStaffCount = result.count.total
        this.pendingStaffList = result.results 

        if(this.pendingStaffCount > 0){
          this.ptTrigger.next(this.pendingStaffList)
        }        
        
      },      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(userPendingSubscr);

  }

  getMembers() {
    let assembly = 0

    const memberSubscr = this.cbfService.getAllMembers(assembly, this.accessToken)

    .subscribe({
      next: (response: any) => {
        let queryResults = response

        this.memberListing = queryResults.results

        this.memberListing.forEach((x:any) => {
          let mem_id = x.user_id
          let mem_name = x.name

          let memberDict = {'id':mem_id, 'name':mem_name}
          this.membersArray.push(memberDict)

        });
        
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Something went wrong, please try again'     
    })
    
    this.unsubscribe.push(memberSubscr);

  }

  activateUserAction(data: any) {
    
    let modalData = data
    let User = modalData.id

    const apprvData:FormData = new FormData()
    apprvData.append('is_active', true.toString())

    const activSubscr = this.cbfService.updateSpecificUser(apprvData, User, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
         
          this.messageResponse = 'Staff successfuly activated'
            
          setTimeout(() => {
            window.location.reload()
          }, 1200);
          
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
    let User = modalData.id

    const deactdata:FormData = new FormData()
    deactdata.append('is_active', true.toString())

    const dactivSubscr = this.cbfService.updateSpecificUser(deactdata, User, this.accessToken)

    .subscribe({
      next: (response: any) => {
        
        if(response.id){
         
          this.messageResponse = 'Staff successfuly deactivated'
            
          setTimeout(() => {
            window.location.reload()
          }, 1200);
          
        }
        
      },
      error: (e:HttpErrorResponse) =>  {
        this.messageResponse = 'Something went wrong, please try again'
      }   
    })
    
    this.unsubscribe.push(dactivSubscr);
  }

  saveStaff() {

    const regData:FormData = new FormData()
    regData.append('full_name', this.staffRegistration.get('fullName')?.value)
    regData.append('email', this.staffRegistration.get('email')?.value)
    regData.append('phone_number', this.staffRegistration.get('phoneNumber')?.value)
    regData.append('password', this.staffRegistration.get('password')?.value)
    regData.append('assembly', this.staffRegistration.get('assembly')?.value)
    regData.append('user', this.user_id.toString())

    const regsterSubscr = this.cbfService.registerStaff(regData, this.accessToken)

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
        this.msg = 'Either a user with this email already exists or an error has occured, please try again'  
        this.messageResponse = this.msg
      }   
    })
    
    this.unsubscribe.push(regsterSubscr);
  }

  convertStaffAction() {

    let selectedMemberId = this.selectedMember

    if(selectedMemberId != 0){

      const updateData:FormData = new FormData()
      updateData.append('is_staff', true.toString())
      updateData.append('user', this.user_id.toString())
      
      const convMemberSubscr = this.cbfService.updateSpecificUser(updateData, selectedMemberId, this.accessToken)

      .subscribe({
        next: (response: any) => {
          
          if(response.id){
         
            this.messageResponse = 'Member successfuly converted to staff'
              
            setTimeout(() => {
              window.location.reload()
            }, 1200);
            
          }
          
        },
        error: (e:HttpErrorResponse) =>  {
          this.messageResponse = 'Something went wrong, please try again'  
        }   
      })
      
      this.unsubscribe.push(convMemberSubscr);
 
    } else {
      this.messageResponse = 'Please select a member'
    }

  }

  updateStaff(data: any) {

    let modalData = data

    const updateData:FormData = new FormData()
    updateData.append('full_name', modalData.full_name)
    updateData.append('email', modalData.email)
    updateData.append('phone_number', modalData.phone_number)

    if(this.passwordValue != '' && modalData.password != ''){
      updateData.append('password', modalData.password)
    }

    if(modalData.assemblyUpdate !== undefined){
      updateData.append('assembly', modalData.assemblyUpdate)
    } else {
      updateData.append('assembly', '0'.toString())
    }

    updateData.append('userID', modalData.id)
    updateData.append('user', this.user_id.toString())

    
    const updSubscr = this.cbfService.updateStaff(updateData, this.accessToken)

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
    
    this.unsubscribe.push(updSubscr);

  }

  deleteMemberAction(data: any) {

    let modalData = data

    const delData:FormData = new FormData()
    delData.append('staffId', modalData.id)
    delData.append('user', this.user_id.toString())

    const delSubscr = this.cbfService.deleteStaff(delData, this.accessToken)

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

  approveStaffAction(data: any) {

    let modalData = data

    const apprvData:FormData = new FormData()
    apprvData.append('type', 'approve')
    apprvData.append('staffId', modalData.id)
    apprvData.append('user', this.user_id.toString())

    const apprvSubscr = this.cbfService.reviewStaff(apprvData, this.accessToken)

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
        this.msg = 'Something went wrong, please try again'  
        this.messageResponse = this.msg
      }   
    })
    
    this.unsubscribe.push(apprvSubscr);

  }

  revokeStaffAction(data: any) {

    let modalData = data

    const apprvData:FormData = new FormData()
    apprvData.append('type', 'reject')
    apprvData.append('staffId', modalData.id)
    apprvData.append('user', this.user_id.toString())

    const rejectSubscr = this.cbfService.reviewStaff(apprvData, this.accessToken)

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
    
    this.unsubscribe.push(rejectSubscr);

  }

}
