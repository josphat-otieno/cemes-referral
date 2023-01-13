import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import ls from 'localstorage-slim';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private cookieService: CookieService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const cookieValue = this.cookieService.get('JTW');
    if (typeof cookieValue == "undefined" && cookieValue == null || cookieValue == '') {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state} });
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