import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiEndpointService {

  public static MAIN_CONTEXT = '/api';
  public static CONTEXT = '';

  public static ENDPOINT = {

    //User    
    IMAGE_FOLDER: `${ApiEndpointService.CONTEXT}/media/`,
    REGISTER_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/register/`, 
    LOGIN_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/login/`, 
    EMAIL_REQUEST: `${ApiEndpointService.MAIN_CONTEXT}/user/request-reset-email/`,
    GET_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/get-profile/`,
    UPDATE_PROFILE: `${ApiEndpointService.MAIN_CONTEXT}/user/`,
    UPDATE_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/edit-user/`,
    RETRIEVE_TOKEN: `${ApiEndpointService.MAIN_CONTEXT}/user/token/refresh/`,

    // Membership
    REGISTER_MEMBER: `${ApiEndpointService.MAIN_CONTEXT}/user/register-member-admin/`,
    VERIFY_MEMBER: `${ApiEndpointService.MAIN_CONTEXT}/user/verify-member-admin/`,
    VERIFY_APP_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/verify-app-user-admin/`,
    UPDATE_MEMBER: `${ApiEndpointService.MAIN_CONTEXT}/user/update-member-admin/`,
    DELETE_MEMBER: `${ApiEndpointService.MAIN_CONTEXT}/user/delete-member-admin/`,
    GET_ALL_MEMBERS: `${ApiEndpointService.MAIN_CONTEXT}/user/get-member-list/`,
    GET_MEMBER_VERIFICATIONS: `${ApiEndpointService.MAIN_CONTEXT}/user/get-member-verification-list/`,
    GET_ALL_APP_USERS: `${ApiEndpointService.MAIN_CONTEXT}/user/get-app-user-list/`,

    // Management    
    GET_ASSEMBLIES: `${ApiEndpointService.MAIN_CONTEXT}/management/assembly/`,

    // Businesses
    GET_BUSINESS_LIST: `${ApiEndpointService.MAIN_CONTEXT}/business/get-business-list/`,
    UPDATE_BUSINESS_DETAILS: `${ApiEndpointService.MAIN_CONTEXT}/business/business/`,
    BUSINESS_PRODUCT: `${ApiEndpointService.MAIN_CONTEXT}/business/business-product/`,

  }

  constructor() { }

  public static getEndpoint(endpoint: string): string {
    const protocol: string = environment.http;
    const domain: string = environment.domain;
    const context: string = environment.context;
    return `${protocol}${domain}${context}${endpoint}`;

  }

  public static isApiEndpoint(url: string = ''): boolean {
    return url.toLocaleLowerCase().indexOf(environment.context) > -1;
  }
}
