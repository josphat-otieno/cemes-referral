import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError, BehaviorSubject, Subscription, of } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { ApiEndpointService } from './api-endpoint.service';
import { CookieService } from 'ngx-cookie-service';
import ls from 'localstorage-slim';
import { Router } from '@angular/router';
// import * as _ from 'lodash';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root'
})
export class CbfService implements OnDestroy {
  // private
  private unsubscribe: Subscription[] = [];

  // public variables  
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject:any = undefined
  AccessToken:string = ''
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.getUserByToken();
  }

  constructor(
    public http: HttpClient,
    private cookieService: CookieService,
    private router:Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  /* ------------------------------------------------------------------------- Auth Management ---------------------------------------------------------------- */
  
  // Login User
  public loginUser(loginCredentials: UserModel): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.LOGIN_USER);
    const params = new HttpParams();
    return this.http.post<UserModel>(url, loginCredentials, { params }).pipe(
      map( (response: any) => {
        this.getUserByToken()
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }
  
  // Refresh JWT token
  public getAccess(jwt: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.RETRIEVE_TOKEN);
    return this.http.post<any>(url, {
      'refresh': jwt
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    );
  }

  // get auth from ls
  public getAuthFromLocalStorage(): string | undefined {
    try {
      const lsValue = this.cookieService.get("JTW");

      if (!lsValue) {
        return undefined;
      }

      const authData = lsValue.toString();
      return authData;
    } catch (error) {
      // console.error(error);
      return undefined;
    }
  }

  // get user auth
  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.getAccess(auth).pipe(
      map((res: any) => {
        if (res.access) {
          const userId = Number(ls.get('id', {decrypt: true, secret: 43}));
          this.currentUserSubject.next(userId.toString());
          this.AccessToken = res.access.toString();
        } else {
          this.logoutUser();
        }
        return this.currentUserSubject;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  
  // logout
  public logoutUser() {
    this.cookieService.deleteAll();
    ls.clear()
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login'], {
      queryParams: {},
    });
  }

  /* ------------------------------------------------------------------------- User Management ---------------------------------------------------------------- */
  
  // Register User
  public createUser(userDetails: FormData): Observable<UserModel> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.REGISTER_USER);
    return this.http.post<UserModel>(url, userDetails).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    );
  }

  // Get User Detail
  public getUser(user_id: number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_USER);
    return this.http.get<any>(url + user_id, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  // reset email address
  public resetEmail(requestData: FormData): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.EMAIL_REQUEST);
    return this.http.post<any>(url, requestData).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);
      })
    )
  }

  /* ------------------------------------------------------------------- Membership Endpoints --------------------------------------------------------------------------------------------------- */
  
  // Get member list
  public getAllMembers(assembly:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_ALL_MEMBERS);
    return this.http.get<any>(url+'?assembly_Id='+assembly, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  // Get pending member list
  public getPendingMembers(assembly:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_MEMBER_VERIFICATIONS);
    return this.http.get<any>(url+'?assembly_Id='+assembly, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  // App Users  
  public getAppUsers(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_ALL_APP_USERS);
    return this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  // register members
  public registerMember(memberData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.REGISTER_MEMBER);
    return this.http.post<any>(url, memberData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  // Update member
  public updateMember(memberData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.UPDATE_MEMBER);
    return this.http.post<any>(url, memberData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  // Verify member
  public verifyMember(memberData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.VERIFY_MEMBER);
    return this.http.post<any>(url, memberData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  // Verify App User
  public verifyAppUser(userData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.VERIFY_APP_USER);
    return this.http.post<any>(url, userData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  // Delete Member
  public deleteMember(memberData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.DELETE_MEMBER);
    return this.http.post<any>(url, memberData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  /* ------------------------------------------------------------------- Business Management Endpoints --------------------------------------------------------------------------------------------------- */
  
  // Get business list
  public getVerifiedBusinesses(verification:boolean, assembly:number, businessOwner:number, businessCategory:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_BUSINESS_LIST);
    return this.http.get<any>(url+'?assemblyId='+assembly+'&businessOwner='+businessOwner+'&categoryId='+businessCategory+'&verification='+verification, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  // Get products
  public getProducts(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_PRODUCT);
    return this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  // Update Business Details
  public alterBusinessData(businessData:FormData, businessId:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.UPDATE_BUSINESS_DETAILS);
    return this.http.patch<any>(url + businessId + '/', businessData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  /* ------------------------------------------------------------------- CBF Management Endpoints --------------------------------------------------------------------------------------------------- */
  
  // Get Assemblies
  public getAssemblies(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_ASSEMBLIES);
    return this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
