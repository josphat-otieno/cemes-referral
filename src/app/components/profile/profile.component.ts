import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ApiEndpointService } from 'src/app/core/api-endpoint.service';
import { CbfService } from 'src/app/core/cbf.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user_id:number = 0
  public access_token:string = ''
  public loginName:string = ''
  public loginEmail:string = ''
  public loginPhone:string = ''
  public memStatus:boolean = false
  public profilePic:string = ''
  
  public mediaUrl = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.IMAGE_FOLDER);
  private unsubscribe: Subscription[] = [];

  constructor(private modalService: NgbModal,
    private cbfService:CbfService) {}

  ngOnInit(): void {
    
    if(this.loginName == ''){
      this.access_token =  this.cbfService.AccessToken
      this.user_id = Number(this.cbfService.currentUserValue)
      this.getUserDetail(this.access_token)
    }
	}

  logOut() {
    this.cbfService.logoutUser()
  }

  getUserDetail(access:string){   
    let access_tk = access

    const userSubscr = this.cbfService.getUser(this.user_id, access_tk)
    // .map(region_name)
    .subscribe({
      next: (response: any) => {
        // console.log(response)
        let result = response   

        this.loginName = result.full_name;
        this.loginEmail = result.email;
        this.loginPhone = result.phone_number;
        // this.memStatus = result.is_member
        // this.role = result.role;
        let b_url = this.mediaUrl;
        this.profilePic = b_url+result.profile_picture;

      },
      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(userSubscr);

  }

  // Modals
  openModal(content:any, size: string) {
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      size: size
    });

	}

  
  news = [
        {
          image: "assets/images/profile/5.jpg",
          title: "Collection of textile samples",
          description: "I shared this on my fb wall a few months back, and I thought.",
          url: "admin/post-details",
        },
        {
          image: "assets/images/profile/6.jpg",
          title: "Collection of textile samples",
          description: "I shared this on my fb wall a few months back, and I thought.",
          url: "admin/post-details",
        },
        {
          image: "assets/images/profile/7.jpg",
          title: "Collection of textile samples",
          description: "I shared this on my fb wall a few months back, and I thought.", 
          url: "admin/post-details",
        },
    
  ];
  
  
	
	open(content:any) {
		this.modalService.open(content);
	}

}
