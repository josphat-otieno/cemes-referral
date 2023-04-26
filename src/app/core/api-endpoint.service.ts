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
    DASHBOARD_METRICS: `${ApiEndpointService.MAIN_CONTEXT}/management/get-dashboard-metrics/`,
    TOP_BUSINESSES: `${ApiEndpointService.MAIN_CONTEXT}/management/get-top-businesses/`,

    //User    
    IMAGE_FOLDER: `${ApiEndpointService.CONTEXT}/media/`,
    REGISTER_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/register/`, 
    LOGIN_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/login/`, 
    EMAIL_REQUEST: `${ApiEndpointService.MAIN_CONTEXT}/user/request-reset-email/`,
    CHANGE_PASSWORD: `${ApiEndpointService.MAIN_CONTEXT}/user/password-reset-complete`,
    GET_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/get-profile/`,    
    GET_ADMIN_PROFILE: `${ApiEndpointService.MAIN_CONTEXT}/user/get-admin-profile/`,    
    GET_ALL_STAFF: `${ApiEndpointService.MAIN_CONTEXT}/user/get-staff-list/`,
    UPDATE_PROFILE: `${ApiEndpointService.MAIN_CONTEXT}/user/`,
    UPDATE_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/edit-user/`,    
    REGISTER_STAFF_MEMBER: `${ApiEndpointService.MAIN_CONTEXT}/user/register-staff-admin/`,
    UPDATE_STAFF: `${ApiEndpointService.MAIN_CONTEXT}/user/update-staff-admin/`,
    DELETE_STAFF: `${ApiEndpointService.MAIN_CONTEXT}/user/delete-staff-admin/`,
    REVIEW_STAFF: `${ApiEndpointService.MAIN_CONTEXT}/user/review-staff-admin/`,
    RETRIEVE_TOKEN: `${ApiEndpointService.MAIN_CONTEXT}/user/token/refresh/`,

    // Membership
    REGISTER_MEMBER: `${ApiEndpointService.MAIN_CONTEXT}/user/register-member-admin/`,
    VERIFY_MEMBER: `${ApiEndpointService.MAIN_CONTEXT}/user/verify-member-admin/`,
    VERIFY_APP_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/verify-app-user-admin/`,
    CONVERT_APP_USER: `${ApiEndpointService.MAIN_CONTEXT}/user/convert-app-user/`,
    UPDATE_MEMBER: `${ApiEndpointService.MAIN_CONTEXT}/user/update-member-admin/`,
    DELETE_MEMBER: `${ApiEndpointService.MAIN_CONTEXT}/user/delete-member-admin/`,
    GET_ALL_MEMBERS: `${ApiEndpointService.MAIN_CONTEXT}/user/get-member-list/`,
    GET_MEMBER_VERIFICATIONS: `${ApiEndpointService.MAIN_CONTEXT}/user/get-member-verification-list/`,
    GET_ALL_APP_USERS: `${ApiEndpointService.MAIN_CONTEXT}/user/get-app-user-list/`,

    // Management    
    ASSEMBLY_MGT: `${ApiEndpointService.MAIN_CONTEXT}/management/assembly/`,
    ACCOUNT_PACKAGES: `${ApiEndpointService.MAIN_CONTEXT}/management/account-package/`,
    GET_ADVERTSIEMENTS: `${ApiEndpointService.MAIN_CONTEXT}/management/get-advertisement-list/`,
    GET_REJECTED_ADVERTSIEMENTS: `${ApiEndpointService.MAIN_CONTEXT}/management/get-rejected-adverts-list/`,
    ADVERTISEMENT: `${ApiEndpointService.MAIN_CONTEXT}/management/advertisement/`,
    PROFANITY_LIST: `${ApiEndpointService.MAIN_CONTEXT}/management/get-profanity-list/`,
    MEMBER_COMPLAINTS: `${ApiEndpointService.MAIN_CONTEXT}/management/get-member-complaints/`,

    // Businesses
    BUSINESS_DETAIL: `${ApiEndpointService.MAIN_CONTEXT}/business/business/`,
    GET_BUSINESS_LIST: `${ApiEndpointService.MAIN_CONTEXT}/business/get-business-list/`,
    GET_PRODUCTS_LIST: `${ApiEndpointService.MAIN_CONTEXT}/business/get-products-list/`,
    GET_REJECTED_PRODUCTS_LIST: `${ApiEndpointService.MAIN_CONTEXT}/business/get-rejected-products-list/`,
    GET_BUSINESS_RATINGS: `${ApiEndpointService.MAIN_CONTEXT}/business/get-business-rating-list/`,
    GET_REJECTED_BUSINESS_RATINGS: `${ApiEndpointService.MAIN_CONTEXT}/business/get-rejected-business-rating-list/`,
    BUSINESS_REVIEW: `${ApiEndpointService.MAIN_CONTEXT}/business/business-review/`,
    GET_BUSINESS_OWNERS: `${ApiEndpointService.MAIN_CONTEXT}/business/get-business-owners/`,
    UPDATE_BUSINESS_DETAILS: `${ApiEndpointService.MAIN_CONTEXT}/business/business/`,
    BUSINESS_PRODUCT: `${ApiEndpointService.MAIN_CONTEXT}/business/business-product/`,
    BUSINESS_CATEGORY: `${ApiEndpointService.MAIN_CONTEXT}/business/business-category/`,
    BUSINESS_SUB_CATEGORY: `${ApiEndpointService.MAIN_CONTEXT}/business/business-sub-category/`,
    GET_BUSINESS_SUB_CATEGORIES: `${ApiEndpointService.MAIN_CONTEXT}/business/get-business-sub-category-list/`,

    // Communication
    GET_FORUM_LIST: `${ApiEndpointService.MAIN_CONTEXT}/communication/get-forum-list/`,
    FORUM_MEMBER: `${ApiEndpointService.MAIN_CONTEXT}/communication/forum-member/`,
    FORUM_USERS: `${ApiEndpointService.MAIN_CONTEXT}/communication/forum-user-listing/`,
    FORUM_MGT: `${ApiEndpointService.MAIN_CONTEXT}/communication/forum/`,
    FORUM_CATEGORY: `${ApiEndpointService.MAIN_CONTEXT}/communication/forum-category/`,

    // custom forms
    MANAGE_CUSTOM_FORMS:`${ApiEndpointService.MAIN_CONTEXT}/business/custormforms/`,
    MANAGE_CUSTOM_FORM_ITEMS:`${ApiEndpointService.MAIN_CONTEXT}/business/custormformsItems/`,
    MANAGE_CUSTOM_FORM_FEEDBACK:`${ApiEndpointService.MAIN_CONTEXT}/business/customformfeedback/`,
    MANAGE_CUSTOMFORM_CUSTOMFORMITEM:`${ApiEndpointService.MAIN_CONTEXT}/business/customform-customform-item/`,
    MANAGE_CUSTOM_CUSTOMFORMITEM:`${ApiEndpointService.MAIN_CONTEXT}/business/custom-custom-items/`,
    MANAGE_USERS_EVENTS_CUSTOMFORM_FEEDBACKS_LIST:`${ApiEndpointService.MAIN_CONTEXT}/business/members-custom-form-feedback-details/`,
    MANAGE_USER_EVENTS_CUSTOMFORM_FEEDBACKS_LIST:`${ApiEndpointService.MAIN_CONTEXT}/business/user-feedback-details/`,
    GET_CUSTOM_FORMS:`${ApiEndpointService.MAIN_CONTEXT}/business/ get-custom-forms/`,
    GET_CUSTOM_FORM_ITEMS:`${ApiEndpointService.MAIN_CONTEXT}/business/get-custom-form-items/`,

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
