import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError, BehaviorSubject, Subscription, of } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { NewPassword, UserModel } from '../models/user.model';
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
    this.cookieService.delete('JTW');
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

  // Update User
  public updateSpecificUser(userDetails: FormData, userId:number, access:string): Observable<UserModel> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.UPDATE_USER);
    return this.http.patch<UserModel>(url+userId, userDetails, {
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
    );
  }

  // Update P.pic
  public updateProfilePicture(userId: number, ImageData: FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.UPDATE_PROFILE);
    return this.http.patch<any>(url + userId + '/update-profile/', ImageData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(fault);
      })
    )

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

  // Get User Profile
  public getUserProfile(user_id: number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_ADMIN_PROFILE);
    return this.http.get<any>(url + '?user_id=' + user_id, {
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

  // register Staff
  public registerStaff(memberData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.REGISTER_STAFF_MEMBER);
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

  // Get Staff
  public getStaff(verificationStatus:string, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_ALL_STAFF);
    return this.http.get<any>(url+'?verified='+verificationStatus, {
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

   // Verify Staff
   public reviewStaff(staffData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.REVIEW_STAFF);
    return this.http.post<any>(url, staffData, {
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

  // Update Staff
  public updateStaff(staffData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.UPDATE_STAFF);
    return this.http.post<any>(url, staffData, {
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
  
  // Delete Staff
  public deleteStaff(staffData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.DELETE_STAFF);
    return this.http.post<any>(url, staffData, {
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

  // reset Password
  public resetPassword(passwordInfo: FormData): Observable<NewPassword> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.CHANGE_PASSWORD);
    return this.http.patch<NewPassword>(url, passwordInfo).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);
      })
    )
  }
  

  /* ------------------------------------------------------------------- Dashboard Endpoints --------------------------------------------------------------------------------------------------- */
  
  // Get Dashboard metrics
  public getDashboardMetrics(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.DASHBOARD_METRICS);
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

  // Get Dashboard Top Businesses
  public getTopBusinesses(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.TOP_BUSINESSES);
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

  // Convert app user to member
  public convertAppUser(appUserData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.CONVERT_APP_USER);
    return this.http.post<any>(url, appUserData, {
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
  
  // Get business details
  public getBusinessDetail(businessId:Number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_DETAIL);
    return this.http.get<any>(url + businessId + '/', {
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

  // register business
  public registerBusiness(businessData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_DETAIL);
    return this.http.post<any>(url, businessData, {
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

  // get business Owners
  public getBusinessOwnerList(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_BUSINESS_OWNERS);
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

  // Get Products list
  public getVerifiedProducts(verification:boolean, assembly:number, business:number, businessOwner:number, businessCategory:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_PRODUCTS_LIST);
    return this.http.get<any>(url+'?assemblyId='+assembly+'&businessId='+business+'&businessOwner='+businessOwner+'&categoryId='+businessCategory+'&verification='+verification, {
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

  // Get Rejected Products list
  public getRejectedProductsList(assembly:number, business:number, businessOwner:number, businessCategory:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_REJECTED_PRODUCTS_LIST);
    return this.http.get<any>(url+'?assemblyId='+assembly+'&businessId='+business+'&businessOwner='+businessOwner+'&categoryId='+businessCategory, {
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

  // Get business Ratings
  public getBusinessRatings(verification:boolean, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_BUSINESS_RATINGS);
    return this.http.get<any>(url+'?verification='+verification, {
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

  // Get rejected business Ratings
  public getRejectedBusinessRatings(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_REJECTED_BUSINESS_RATINGS);
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

  // Update Business Rating
  public updateBusinessRating(ratingId:number, ratingData: FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_REVIEW);
    return this.http.patch<any>(url+ratingId+'/', ratingData, {
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
  public updateBusiness(businessData:FormData, businessId:number, access: string): Observable<any> {
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

  // Update Product Details
  public updateProduct(productData:FormData, productId:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_PRODUCT);
    return this.http.patch<any>(url + productId + '/', productData, {
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
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.ASSEMBLY_MGT);
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

  // create Assembly
  public registerAssembly(assemblyData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.ASSEMBLY_MGT);
    return this.http.post<any>(url, assemblyData, {
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

  // Update Assembly
  public updateAssembly(assemblyData:FormData, assemblyId:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.ASSEMBLY_MGT);
    return this.http.patch<any>(url+assemblyId+'/', assemblyData, {
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

  // Get Packages
  public getAccountPackages(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.ACCOUNT_PACKAGES);
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

  // create account package
  public registerPackage(packageData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.ACCOUNT_PACKAGES);
    return this.http.post<any>(url, packageData, {
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

  // Update Package
  public updatePackage(packageData:FormData, packageId:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.ACCOUNT_PACKAGES);
    return this.http.patch<any>(url+packageId+'/', packageData, {
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

  // Get Business categories
  public getBusinessCategories(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_CATEGORY);
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

  // Get Active Business categories
  public getActiveBusinessCategories(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_CATEGORY);
    return this.http.get<any>(url+'?is_deleted=false', {
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

  // create business category
  public registerBusinessCategory(businessData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_CATEGORY);
    return this.http.post<any>(url, businessData, {
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

  // Update Business Category
  public updateBusinessCategory(businessData:FormData, bizId:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_CATEGORY);
    return this.http.patch<any>(url+bizId+'/', businessData, {
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

   // Get Business sub categories
   public getBusinessSubCategories(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_BUSINESS_SUB_CATEGORIES);
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

  // create business sub category
  public registerBusinessSubCategory(businessData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_SUB_CATEGORY);
    return this.http.post<any>(url, businessData, {
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

  // Update Business SUb Category
  public updateBusinessSubCategory(businessData:FormData, bizId:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.BUSINESS_SUB_CATEGORY);
    return this.http.patch<any>(url+bizId+'/', businessData, {
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

   // Get forum category
   public getForumCategory(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_CATEGORY);
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

   // Get active forum categories
   public getActiveForumCategories(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_CATEGORY);
    return this.http.get<any>(url+'?is_deleted=false', {
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

  // create forum category
  public registerForumCategory(forumData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_CATEGORY);
    return this.http.post<any>(url, forumData, {
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

  // Update Forum category
  public updateForumCategory(forumData:FormData, categoryId:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_CATEGORY);
    return this.http.patch<any>(url+categoryId+'/', forumData, {
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

  // Get forum
  public getForumListing(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_FORUM_LIST);
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

  // Create forum Members
  public saveForumMember(memberData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_MEMBER);
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

  // Remove forum Members
  public revokeForumMember(memberId:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_MEMBER);
    return this.http.delete<any>(url + memberId + '/', {
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

  // Get forum Members - generic
   public getForumMembers(forumId: number, isAdmin:boolean, status:boolean, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_MEMBER);
    return this.http.get<any>(url+'?forum_id='+forumId+'&is_admin='+isAdmin+'&accepted_invite='+status, {
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

  // Get forum Members - custom
  public getForumUsers(forumId: number, membership_status:boolean, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_USERS);
    return this.http.get<any>(url+'?forum_id='+forumId+'&is_member='+membership_status, {
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

  // Get Notification Messages
  public getNotificationMessages(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.NOTIFICATION_MESSAGE);
    return this.http.get<any>(url, {
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

    // Get Notification Message details
    public getNotificationMessage(msg_id:number, access: string): Observable<any> {
      const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.NOTIFICATION_MESSAGE);
      return this.http.get<any>(url + msg_id + '/', {
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

  // Get Event Notification Reminders
  public getEventReminders(eventID:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.EVENT_REMINDERS);
    return this.http.get<any>(url + '?eventID=' + eventID, {
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

  // Create Notification Messages
  public saveNotificationMessage(formData: FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.NOTIFICATION_MESSAGE);
    return this.http.post<any>(url, formData, {
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

  // Update Message
  public updateMessage(msg_id: number, msgData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.NOTIFICATION_MESSAGE);
    return this.http.patch<any>(url + msg_id + '/', msgData, {
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

  // Delete Message
  public deleteMessage(msgID: number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.NOTIFICATION_MESSAGE);
    return this.http.delete<any>(url + msgID + '/', {
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

  // Get custom Forms - custom
  // public getCustomForms(access: string): Observable<any> {
  //   const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_CUSTOM_FORMS);
  //   return this.http.get<any>(url, {
  //     headers: {
  //       'Content-Type': 'application/json; charset=utf-8',
  //       'Accept': 'application/json',
  //       'Authorization': `Bearer ${access}`
  //     }
  //   }).pipe(
  //     map(function (response: any) {
  //       return response;
  //     }),
  //     catchError((fault: HttpErrorResponse) => {
  //       return throwError(() => fault);

  //     })
  //   )

  // }

          /* ------------------- EVENTS --------------------- */

  // create event
  public registerEvent(eventData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.CITAM_EVENT);
    return this.http.post<any>(url, eventData, {
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
  
  // Update event
  public updateEvent(eventID: number, eventData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.CITAM_EVENT);
    return this.http.patch<any>(url + eventID + '/', eventData, {
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

  // Delete event
  public deleteEvent(eventID: number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.CITAM_EVENT);
    return this.http.delete<any>(url + eventID + '/', {
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
  
  // Get Events
  public getEventDetails(filteredEvent:number , access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_EVENTS);
    return this.http.get<any>(url + '?event_id=' + filteredEvent, {
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

  // Get Event Payments
  public getEventPayments(filteredEvent:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_EVENT_PAYMENTS);
    return this.http.get<any>(url + '?event_id=' + filteredEvent, {
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

  // Create Custom Notification Reminder
  public createCustomNotification(notificationData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.CUSTOM_NOTIFICATION);
    return this.http.post<any>(url, notificationData, {
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
  
  // Update Custom Notification Reminder
  public updateReminder(msg_id: number, msgData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.CUSTOM_NOTIFICATION);
    return this.http.patch<any>(url + msg_id + '/', msgData, {
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

  // Delete Custom Notification Reminder
  public deleteReminder(msgID: number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.CUSTOM_NOTIFICATION);
    return this.http.delete<any>(url + msgID + '/', {
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

  // Save event programs
  public createProgram(programData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.PROGRAMS);
    return this.http.post<any>(url, programData, {
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
  
  // Get Event Programs
  public getProgramDetails(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_PROGRAMS);
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

  // Update event Program
  public updateEventProgram(programId: number, programData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.PROGRAMS);
    return this.http.patch<any>(url + programId + '/', programData, {
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

  // Delete event Program
  public deleteEventProgram(programId: number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.PROGRAMS);
    return this.http.delete<any>(url + programId + '/', {
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
  
  // Create Event Program Item
  public createProgramItem(prData: FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.PROGRAM_ITEMS);
    return this.http.post<any>(url, prData, {
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

  // Update event Program Item
  public updateProgramItem(programItemId: number, programData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.PROGRAM_ITEMS);
    return this.http.patch<any>(url + programItemId + '/', programData, {
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

  // Delete event Program Item
  public deleteProgramItem(programItemId: number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.PROGRAM_ITEMS);
    return this.http.delete<any>(url + programItemId + '/', {
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

  //  get CustomFormCustomFormItems
  public getCustomFormCustomFormItems(formId: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOMFORM_CUSTOMFORMITEM);
    return this.http.get<any[]>(url + '?custom_form_id=' + formId+'&ordering=id', {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(fault);
      })
    )
  }

  // get custom form item
  public getCustomFormItem(formId: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORM_ITEMS);
    return this.http.get<any[]>(url + formId , {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(fault);
      })
    )
  }


  // create forum
  public registerForum(forumData:FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_MGT);
    return this.http.post<any>(url, forumData, {
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

  // Get forum
  public getForumDetails(forumId:Number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_MGT);
    return this.http.get<any>(url + forumId + '/', {
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
  
  // Update Forum
  public updateForum(forumData:FormData, forumId:number, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.FORUM_MGT);
    return this.http.patch<any>(url+forumId+'/', forumData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map(function (response: any) {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        // return throwError(() => fault);

        let errorMessage = '';
        if (fault.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${fault.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${fault.status}\nMessage: ${fault.message}`;
        }
        // console.log(errorMessage);

        return throwError(`${errorMessage}`)

      })
    )

  }

  // Get Profanity list
  public getProfanityListing(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.PROFANITY_LIST);
    return this.http.get<any>(url, {
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

  // get member Complaints
  public getMemberComplaints(filter:string, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MEMBER_COMPLAINTS);
    return this.http.get<any>(url + '?fiter_type_string=' + filter, {
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


  /* ------------ ADVERTISEMENTS ------------------ */

  // Get Advertisements
  public getAdvertisements(verification:boolean, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_ADVERTSIEMENTS);
    return this.http.get<any>(url+'?verification='+verification, {
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

  // Get rejected Advertisements
  public getRejectedAdvertisements(access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_REJECTED_ADVERTSIEMENTS);
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

  // Update Advertisement
  public updateAdvertisement(advertId:number, advertData: FormData, access: string): Observable<any> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.ADVERTISEMENT);
    return this.http.patch<any>(url+advertId+'/', advertData, {
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


  /** custom form management */

  // create custom form
  public createCustomForm(customForm: any , access: string): Observable<any> {
    const params = new HttpParams();
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORMS);
    return this.http.post<any>(url, customForm, {
      params, headers: {
    
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }

// get custom form
  public getCustomForms( access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORMS);
    return this.http.get<any[]>(url,  {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }

// get spefic custom form
  public getCustomForm(formId: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORMS);
    return this.http.get<any[]>(url + formId, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((fault: HttpErrorResponse) => {
        return throwError(fault);
      })
    )
  }

// update custom custom form
  public updateCustomForm(formId: number, customData: FormData, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORMS);
    return this.http.patch<any[]>(url + formId+'/', customData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }

  //Delete custom form
  public deleteCustomForm(formId: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORMS);
    return this.http.delete<any[]>(url + formId, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }

  // manage custom forms items
  public createCustomFormItem(customForm: any, access: string): Observable<any> {
    const params = new HttpParams();
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORM_ITEMS);
    return this.http.post<any>(url, customForm, {
      params, headers: {
 
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }



  // get custom form items
  public getCustomFormsItems( access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORM_ITEMS);
    return this.http.get<any[]>(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }


// update custom form item
  public updateCustomFormItem(formId: number, customData: FormData, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORM_ITEMS);
    return this.http.patch<any[]>(url + formId+'/', customData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }

  // delete custom form item

  public deleteCustomFormItem(formId: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORM_ITEMS);
    return this.http.delete<any[]>(url + formId, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }



  // manage customformcustomformitems
//  create customformcustomformitem
  public createCustomFormCustomFormItem(customForm: FormData, access: string): Observable<any> {
    const params = new HttpParams();
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOMFORM_CUSTOMFORMITEM);
    return this.http.post<any>(url, customForm, {
      params, headers: {

        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }
    // manage customformcustomformitems
//  create customformcustomformitem
public createCustomCustomFormItem(customForm: FormData, access: string): Observable<any> {
  const params = new HttpParams();
  const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_CUSTOMFORMITEM);
  return this.http.post<any>(url, customForm, {
    params, headers: {

      'Authorization': `Bearer ${access}`
    }
  }).pipe(
    map((response: any) => {
      return response;
    }),
          catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
  )
}


  //  get CustomFormCustomFormItems
  // public getCustomFormCustomFormItems(formId: number, access: string): Observable<any[]> {
  //   const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOMFORM_CUSTOMFORMITEM);
  //   return this.http.get<any[]>(url + '?custom_form_id=' + formId+'&ordering=id', {
  //     headers: {
  //       'Content-Type': 'application/json; charset=utf-8',
  //       'Accept': 'application/json',
  //       'Authorization': `Bearer ${access}`
  //     }
  //   }).pipe(
  //     map((response: any) => {
  //       return response;
  //     }),
  //           catchError((fault: HttpErrorResponse) => {
  //       return throwError(() => fault);

  //     })
  //   )
  // }


  public getEventsCustomFormFeedbackList(custom_form_id: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_USERS_EVENTS_CUSTOMFORM_FEEDBACKS_LIST)
    return this.http.get<any[]>(url + '?custom_form_id=' + custom_form_id, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }


// get specific CustomFormCustomFormItem
// customformcustomformitem/?custom_form_id=2
  public getCustomFormCustomFormItem(custom_form_id: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOMFORM_CUSTOMFORMITEM);
    return this.http.get<any[]>(url + '?custom_form_id='+custom_form_id , {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }

  // get specific CustomFormCustomFormItem using customform_item id

public getCustomFormCustomFormItem_Id(custom_form_id: number,custom_form_item_id: number, access: string): Observable<any[]> {
  const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOMFORM_CUSTOMFORMITEM);
  return this.http.get<any[]>(url + '?custom_form_id='+custom_form_id+'&custom_form_item_id='+custom_form_item_id , {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json',
      'Authorization': `Bearer ${access}`
    }
  }).pipe(
    map((response: any) => {
      return response;
    }),
          catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
  )
}


  // get specific user feedbacks(events)
  public getEventsUserFeedbacksList(user_id: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_USER_EVENTS_CUSTOMFORM_FEEDBACKS_LIST);
    return this.http.get<any[]>(url + '?user_id='+user_id , {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }


// update updateCustomFormCustomFormItem
  public updateCustomFormCustomFormItem(formId: number, customData: FormData, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOMFORM_CUSTOMFORMITEM);
    return this.http.patch<any[]>(url + formId, customData, {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }

// delete customform customform item
  public deleteCustomFormCustomFormItem(formId: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOMFORM_CUSTOMFORMITEM);
    return this.http.delete<any[]>(url + formId, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }


  // manage custom form feedback
  // get custom form feedback by church
  public getCustomFormFeed( access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORM_FEEDBACK);
    return this.http.get<any[]>(url + '?ordering=-id', {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }
  // get custom form response by user id and custom form id
  public getCustomFormFeedByUser(formId:number, userId: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORM_FEEDBACK);
    return this.http.get<any[]>(url + '?custom_form_id='+formId+'&user_id='+userId, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }

  // get custom form feedback by customform id
  public getCustomFormFeedbackByCustomFormId(formId: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOM_FORM_FEEDBACK);
    return this.http.get<any[]>(url + '?custom_form_id='+formId, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }

  // delete custom form feedback
  public deleteCustomFeedback(formId: number, access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.MANAGE_CUSTOMFORM_CUSTOMFORMITEM);
    return this.http.delete<any[]>(url + formId, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }


  public getForms( access: string): Observable<any[]> {
    const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_CUSTOM_FORMS);
    return this.http.get<any[]>(url,{
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    }).pipe(
      map((response: any) => {
        return response;
      }),
            catchError((fault: HttpErrorResponse) => {
        return throwError(() => fault);

      })
    )
  }


    // get custom form feedback by customform id
    public formItems(formId: number, access: string): Observable<any[]> {
      const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_CUSTOM_FORM_ITEMS);
      return this.http.get<any[]>(url + '?custom_form_id='+formId, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Authorization': `Bearer ${access}`
        }
      }).pipe(
        map((response: any) => {
          return response;
        }),
              catchError((fault: HttpErrorResponse) => {
          return throwError(() => fault);
  
        })
      )

    }

    public addFormItems(formData: FormData, access: string): Observable<any> {
      const params = new HttpParams();
      const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.ADD_FORM_ITEMS);
      return this.http.post<any>(url, formData, {
        params, headers: {
    
          'Authorization': `Bearer ${access}`
        }
      }).pipe(
        map((response: any) => {
          return response;
        }),
              catchError((fault: HttpErrorResponse) => {
            return throwError(() => fault);
    
          })
      )

    }


    public getFeedbacks( access: string): Observable<any[]> {
      const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.GET_FEEDBACKS);
      return this.http.get<any[]>(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Authorization': `Bearer ${access}`
        }
      }).pipe(
        map((response: any) => {
          return response;
        }),
              catchError((fault: HttpErrorResponse) => {
          return throwError(() => fault);
  
        })
      )

    }

    public deleteFormFeedback(form_id:any, access: string): Observable<any> {
      const params = new HttpParams();
      const url = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.ADD_FORM_ITEMS);
      return this.http.post<any>(url+'?custom_form_id='+form_id, {
        params, headers: {
    
          'Authorization': `Bearer ${access}`
        }
      }).pipe(
        map((response: any) => {
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
