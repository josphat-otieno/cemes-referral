import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ls from 'localstorage-slim';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm!:FormGroup
  // public
  
  public defaultAuth: any = {
    full_name: '',
    email: '',
    password: '',
  };
  public msg:string = '';
  public hasError: boolean = false;
  public returnUrl: string = '';

  private unsubscribe: Subscription[] = [];

  constructor(
    private cbfService: CbfService,
    private fb:FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService


  ) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
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

  

  registerUser() {
    this.hasError = false;
    const loginSubscr = this.cbfService.loginUser(this.registerForm.value)

    .subscribe({
      next: (response: any) => {
        let results = response

        // variables
        let jwt = results.data.tokens.refresh
        let staff_verify = results.data.is_staff
        let user_id = results.data.id

        if(staff_verify != true){
          this.msg="Only staff are allowed into this portal.";
        } else {
          this.msg = ''

          //store session cookie
          this.cookieService.set( 'JTW', jwt); // To Set Cookie

          //store user id
          ls.set('id', JSON.stringify(user_id), {encrypt: true, secret: 43});  
          this.cbfService.getUserByToken()       
          this.router.navigate([this.returnUrl]);
        }
      },
      error: (e:HttpErrorResponse) =>  this.msg = 'Invalid credentials, please try again'     
    })
    
    this.unsubscribe.push(loginSubscr);
  }



}
