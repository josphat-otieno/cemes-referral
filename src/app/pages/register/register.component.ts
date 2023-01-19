import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm!:FormGroup

  // validation parameters
  public validity:boolean = false
  public passwordIncorrect:boolean = false
  public passwordLength:boolean = false
  public confirmPassword:boolean = false
  public phoneValidationMessage:boolean = false
  public emailValidationMessage:boolean = false
  
  public defaultAuth: any = {
    full_name: '',
    email: '',
    phoneNumber: '',
    password: '',
    password_confirmed: '',
  };
  public msg:string = '';
  public hasError: boolean = false;
  public returnUrl: string = '';

  // Alerts
  public alertMessage:string = '';
  public successAlert:boolean = false;
  public warningAlert:boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(
    private cbfService: CbfService,
    private fb:FormBuilder,
    private router: Router,
    private toaster: ToastService
  ) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      full_name: [
        this.defaultAuth.full_name,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255), 
        ]),
      ],
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(100), 
        ]),
      ],
      phoneNumber: [
        this.defaultAuth.phoneNumber,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10), 
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(14),
        ]),
      ],
      password_confirmed: [
        this.defaultAuth.password_confirmed,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(14),
        ]),
      ],
    });

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

  checkPasswordEntry(passValue:any) {

    if(passValue != ''){

      if(passValue.length >= 8){
        
        this.passwordLength = false
        this.confirmPassword = true          
        this.validity = true;

      } else {
        this.passwordLength = true              
        this.validity = false;
      }
      
    } else {
      this.confirmPassword = false      
      this.validity = false;
      this.registerForm.get('password_confirmed')?.patchValue('')
    }
  }

  confirmPassEntries(passValue:any) {
    let passOneVal = this.registerForm.get('password')?.value
    let passTwoVal = passValue

    if(passTwoVal != ''){
      
      if(passTwoVal == passOneVal){
        this.passwordIncorrect = false        
        this.validity = true;
      } else {
        this.passwordIncorrect = true        
        this.validity = false;
      }

    } else {
      this.passwordIncorrect = false          
      this.validity = false; 
    }

  }

  registerUser() {
    this.hasError = false;

    const regData:FormData = new FormData()
    regData.append('full_name', this.registerForm.get('full_name')?.value)
    regData.append('email', this.registerForm.get('email')?.value)
    regData.append('phone_number', this.registerForm.get('phoneNumber')?.value)
    regData.append('password', this.registerForm.get('password_confirmed')?.value)
    regData.append('is_staff', true.toString())
    regData.append('is_verified', true.toString())

    const regsterSubscr = this.cbfService.createUser(regData)

    .subscribe({
      next: (response: any) => {
        let results = response

        if(results.data.error){
          this.alertMessage = results.data.error
        } else {
          this.successAlert = true

          setTimeout(() => {
            window.location.reload()
          }, 1360);
        }

      },
      error: (e:HttpErrorResponse) =>  {
        this.msg = 'An account with this email already exists, please try again'
        this.alertMessage = this.msg
      }    
    })
    
    this.unsubscribe.push(regsterSubscr);
  }



}
