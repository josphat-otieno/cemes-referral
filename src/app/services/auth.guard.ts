import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import ls from 'localstorage-slim';
import { CbfService } from '../core/cbf.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private cbfService: CbfService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const cookieValue = this.cookieService.get('JTW');
    const UserId = Number(ls.get('id', {decrypt: true, secret: 43}));

    if (typeof cookieValue == "undefined" && cookieValue == null || cookieValue == '' || UserId == 0 ) {
      // this.router.navigate(['/login']);
      this.cbfService.logoutUser()
      return false;
    } else {      
      return true;
    }
  }

  revokeEntry(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.router.navigate(['/dashboard']);
  }

  // CanActivateChild(state: RouterStateSnapshot){
  //   const churchId = localStorage.getItem('cId');
  //   if(typeof churchId == 'undefined' && churchId == null ){
  //     this.router.navigate(['/home'], { queryParams: { returnUrl: state} });
  //   }
  // }
}