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
