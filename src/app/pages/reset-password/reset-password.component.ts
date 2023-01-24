import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';
import { ToastService } from 'src/app/bootstrap/toast/toast-global/toast-service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordForm:FormGroup | any

  // validation parameters
  public validity:boolean = false
  public passwordIncorrect:boolean = false
  public passwordLength:boolean = false

  public UiD:string = '';
  public Token:string = '';
  public msg:string = '';

  password: string | undefined;
  passwordY: string | undefined;
  
  public defaultAuth: any = {
    password: '',
    password_confirmed: '',
  };

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
    private toaster: ToastService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      const uid = params['uidb64'];
      const token = params['token'];    

      this.UiD = uid;
      this.Token = token;
    });

    // validate point of entry
    if(this.Token == '' || this.Token == undefined){
      this.router.navigate(['/login'])
    }

    this.resetPasswordForm = this.fb.group({
      password: [this.defaultAuth.password,
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
      ]
    })   

  }
  
  // check Passwords
  checkPasswordEntry(passValue:any) {

    if(passValue != ''){

      if(passValue.length >= 8){
        
        this.passwordLength = false       
        this.validity = true;

      } else {
        this.passwordLength = true              
        this.validity = false;
      }
      
    } else {   
      this.validity = false;
      this.resetPasswordForm.get('password_confirmed')?.patchValue('')
    }
  }

  confirmPassEntries(passValue:any) {
    let passOneVal = this.resetPasswordForm.get('password')?.value
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

  changePassword() {
    this.hasError = false;

    const resetPassData:FormData = new FormData()
    resetPassData.append('password', this.resetPasswordForm.get('password_confirm')?.value)
    resetPassData.append('token', this.Token)
    resetPassData.append('uidb64', this.UiD.toString())

    const resetPassSubscr = this.cbfService.resetPassword(resetPassData)

    .subscribe({
      next: (response: any) => {
        let results = response
        console.log(results)

        this.successAlert = true

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1460);

      },
      error: (e:HttpErrorResponse) =>  {
        this.msg = 'Something went wrong, kindly try again'
        this.alertMessage = this.msg
      }    
    })
    
    this.unsubscribe.push(resetPassSubscr);
  }

}
