import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ls from 'localstorage-slim';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public defaultAuth: any = {
    email: '',
    password: '',
  };
  public msg:string = '';
  public hasError: boolean = false;
  public returnUrl: string = '';

  // Alerts
  public alertMessage:string = '';
  public successAlert:boolean = false;
  public warningAlert:boolean = false;

  public signInForm!:FormGroup

  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private cbfService: CbfService,
    private router: Router,
    private cookieService: CookieService,
    private userIdle: UserIdleService
  ) { }

  ngOnInit(): void {

    this.signInForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), 
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ]),
      ],
    });

  }

  // Password Toggle
  toggleEye: boolean = true;

  // toggle password
  toggleEyeIcon(inputPassword:any) {
    this.toggleEye = !this.toggleEye;		
    inputPassword.type = inputPassword.type === 'password' ? 'text' : 'password';
  }

  loginUser() {
    this.hasError = false;
    this.router.navigate(['/admin/dashboard'])
    // const loginSubscr = this.cbfService.loginUser(this.signInForm.value)

    // .subscribe({
    //   next: (response: any) => {
    //     let results = response

    //     // variables
    //     let jwt = results.data.tokens.refresh
    //     let staff_verify = results.data.is_staff
    //     let account_verify = results.data.is_verified
    //     let user_id = results.data.id

    //     if(!jwt){
    //       this.warningAlert = true
    //     } else {
    //       if(staff_verify != true){
    //         this.alertMessage="Only staff are allowed into this portal.";
    //       } else {

    //         this.alertMessage = ''

    //         // check verification
    //         if(account_verify != true){
    //           this.alertMessage = 'Sorry, your account is yet to be verified. Kindly wait for verification'
    //         } else {
              
    //           this.successAlert = true;
  
    //           //store session cookie
    //           this.cookieService.set('JTW', jwt); // To Set Cookie
    
    //           //store user id
    //           ls.set('id', JSON.stringify(user_id), {encrypt: true, secret: 43}); 

    //           // set USer Id and Acstk
    //           this.cbfService.getUserByToken().subscribe()     
                 
    //             //Start watching for user inactivity.
    //             this.userIdle.startWatching();
                
    //             // Start watching when user idle is starting.
    //             // this.userIdle.onTimerStart().subscribe(count => console.log(count));   
                
    //             // Stop watch when time is up.                        
    //             this.userIdle.onTimeout().subscribe(() => this.cbfService.logoutUser());

    //           setTimeout(() => {
    //             this.router.navigate([this.returnUrl]);
    //           }, 2000);

    //         }
           
    //       }
    //     }
      
    //   },
    //   error: (e:HttpErrorResponse) =>  {
    //     console.log(e)
    //     this.alertMessage = 'No account matches these credentials, please try again'
    //   }
    // })
    
    // this.unsubscribe.push(loginSubscr);
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
