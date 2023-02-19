import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ApiEndpointService } from 'src/app/core/api-endpoint.service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public picAltered:boolean = false
  public userExists:boolean = true
  public userRespMsg:string = ''

  public user_id:number = 0
  public access_token:string = ''
  public loginId:string = ''
  public loginName:string = ''
  public loginEmail:string = ''
  public loginPhone:string = ''
  public memStatus:boolean = false
  public activeStatus:boolean = false
  public profilePic:string = ''
  public role:string = ''
  public current_pswd:string = ''

  // biz details
  public biz_count:number = 0
  public review_count:number = 0
  public rating_count:number = 0

  public profileManagement:FormGroup | any

  // pics  
  public upload = 0;
  public actualFile: File | any;
  
  // validation
  public phoneValidationMessage:boolean = false
  public emailValidationMessage:boolean = false
  public validity:boolean = true

  // response
  public messageResponse:string = ''
  public alertResponse:string = ''  
  public resetUrl:string = '';

  public mediaUrl = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.IMAGE_FOLDER);
  private unsubscribe: Subscription[] = [];

  constructor(private modalService: NgbModal,
    private cbfService:CbfService,
    private router:Router) {}

  ngOnInit(): void {
    
    if(this.loginName == ''){
      this.access_token =  this.cbfService.AccessToken
      this.user_id = Number(this.cbfService.currentUserValue)
      this.getUserDetail(this.access_token)
    }
	}

  // On file Select
  onChange(event: any) {

    this.picAltered = true
    this.alertResponse = ''

    const file = event.target.files[0];

    if (event.length === 0)
      return;

    var mimeType = file.type

    if(mimeType.indexOf('image')> -1){

      // check if size is 10MB Max

      if (mimeType.match(/image\/*/) == null) {
        this.alertResponse = "Not An Image, Only images are supported."
        return;
      } else {
        this.upload = 1;        
        this.actualFile = file;

        const img_reader = new FileReader();
        img_reader.onload = () => {
          this.profilePic = img_reader.result as string;
        }
        img_reader.readAsDataURL(file)
      }

    } else {
      this.upload = 0;
      this.alertResponse = "Not An Image, Only images are supported."
      return;

    }
    
  }   

  logOut() {
    this.cbfService.logoutUser()
  }

  getUserDetail(access:string){   
    let access_tk = access

    const userSubscr = this.cbfService.getUserProfile(this.user_id, access_tk)
    .subscribe({
      next: (response: any) => {
        let resp = response 
                
        if(resp.count > 0){

          // get results
          let userdetail = resp.result.response

          this.loginId = userdetail.id;
          this.loginName = userdetail.name;
          this.loginEmail = userdetail.email;
          this.loginPhone = userdetail.phone;
          this.memStatus = userdetail.membership
          this.activeStatus = userdetail.activity
          this.current_pswd = userdetail.password
          this.role = userdetail.role
          // let b_url = this.mediaUrl;
          // this.profilePic = b_url+userdetail.profilePic;
          this.profilePic = userdetail.profilePic;

          // business details
          this.biz_count = userdetail.business.count
          this.review_count = userdetail.business.reviews
          this.rating_count = userdetail.business.ratings

        } else {
          this.userExists = false
          this.userRespMsg = resp.result.message
        }

      },
      
      error: (err: HttpErrorResponse) => {
        this.alertResponse = 'Failure fetching user details, kindly refresh', 'Something went wrong'
      }
    })

    this.unsubscribe.push(userSubscr);

  }

  // Validation
   
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

  // Modals
  openModal(content:any, size: string) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

	}
  
  // reset Password
  resetPassword(emailValue: string) {

    var protocol = location.protocol;
    if(protocol == 'http:'){
      this.resetUrl =  location.origin+'/reset-password/';
    } else {
      this.resetUrl =  location.origin+'/cbf/portal/reset-password/';
    }

    let redirectUrl = this.resetUrl;
    let email = emailValue

    const resetData:FormData = new FormData()
    resetData.append('email', email);
    resetData.append('redirect_url', redirectUrl);

    const resetSubscr = this.cbfService.resetEmail(resetData)

    .subscribe({
      next: (response: any) => {
        let results = response
        if(results.success){

          this.messageResponse = 'Password reset request sent successfully'

          setTimeout(() => {
            this.router.navigate(['/login'])
          }, 1460);

        }

      },
      error: (e:HttpErrorResponse) =>  {
        this.alertResponse = 'Something went wrong reseting password, please try again'
      }    
    })
    
    this.unsubscribe.push(resetSubscr);
  }

  updateProfile(userData: any) {

    let formData = userData
    let userId = formData.id
    let full_name = formData.name
    let emailAddr = formData.email
    let phone_num = formData.login_phone

    const userFormData:FormData = new FormData()
    userFormData.append('full_name', full_name)
    userFormData.append('phone_number', phone_num)
    userFormData.append('email', emailAddr)
    userFormData.append('modified_by', this.user_id.toString())

    const updateSubscr = this.cbfService.updateSpecificUser(userFormData, userId, this.access_token)

    .subscribe({
      next: (response: any) => {

        if(response.id){
          this.messageResponse = 'Profile successfully updated'
          
          setTimeout(() => {
            window.location.reload()
          }, 1200);

        } else {
          this.messageResponse = 'Something went wrong, please try again' 
        }
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.alertResponse = 'Something went wrong, please try again' 
      }   
    })
    
    this.unsubscribe.push(updateSubscr);
  }
  
  updateProfPicture() {  

    let userId = this.user_id
      
    const ImageData:FormData =  new FormData();
    ImageData.append('profile_picture', this.actualFile, this.actualFile.name)

    const updateSubscr = this.cbfService.updateProfilePicture(userId, ImageData, this.access_token)

    .subscribe({
      next: (response: any) => {

        this.messageResponse = 'Profile Picture changed successfully.'
          
        setTimeout(() => {
          window.location.reload()
        }, 1200);
        
      },
      error: (e:HttpErrorResponse) =>  {        
        this.alertResponse = 'Something went wrong, please try again' 
      }   
    })
    
    this.unsubscribe.push(updateSubscr);
  }

  
	
	open(content:any) {
		this.modalService.open(content);
	}

}
