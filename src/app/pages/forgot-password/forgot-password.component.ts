import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public successAlert:boolean = false
  public validity:boolean = false
  public emailValidationMessage:boolean = false
  public alertMessage:string = ''
  public resetPasswordFormGroup:FormGroup | any  
  public resetUrl:string = '';
  
  private unsubscribe: Subscription[] = [];  

  constructor(
    private cbfService: CbfService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.resetPasswordFormGroup = this.formBuilder.group(
      {
        email: ['', Validators.required],
      }
    );
  }

  //validate Email
  validateEmail(value: string) {
    let email = value;

    if(email == ''){
      this.validity = false
    } else {      
      if(!email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")){
        this.emailValidationMessage = true;
        this.validity = false;
      } else {
        this.emailValidationMessage = false;
        this.validity = true;
      }
    }
    
  }

  // reset Password
  resetPassword() {

    var protocol = location.protocol;
    if(protocol == 'http:'){
      this.resetUrl =  location.origin+'/reset-password/';
    } else {
      this.resetUrl =  location.origin+'/cbf/portal/reset-password/';
    }

    let redirectUrl = this.resetUrl;
    let email = this.resetPasswordFormGroup.get('email')?.value;

    const resetData:FormData = new FormData()
    resetData.append('email', email);
    resetData.append('redirect_url', redirectUrl);

    const resetSubscr = this.cbfService.resetEmail(resetData)

    .subscribe({
      next: (response: any) => {
        let results = response
        if(results.success){

          this.resetPasswordFormGroup.reset();
          this.successAlert = true

          setTimeout(() => {
            this.router.navigate(['/login'])
          }, 1460);

        }

      },
      error: (e:HttpErrorResponse) =>  {
        this.alertMessage = 'Something went wrong, please try again'
      }    
    })
    
    this.unsubscribe.push(resetSubscr);
  }


}
