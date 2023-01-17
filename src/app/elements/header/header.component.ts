import { Component, OnInit } from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { HostListener } from "@angular/core";
import { CbfService } from 'src/app/core/cbf.service';
import { CookieService } from 'ngx-cookie-service';
import { ApiEndpointService } from 'src/app/core/api-endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	
	toggleChat: boolean = true;
	toggleSingle: boolean = true;
    fullScreenClass: boolean = false;
    isfullscreen: boolean = false;    
  
    public user_id:number = 0
    public access_token:string = ''
    public loginName:string = ''
    public loginEmail:string = ''
    public profilePic:string = ''
    
    public mediaUrl = ApiEndpointService.getEndpoint(ApiEndpointService.ENDPOINT.IMAGE_FOLDER);
    private unsubscribe: Subscription[] = [];
	
	constructor(
    private cbfService: CbfService
  ) { }
	
	ngOnInit(): void {
    
    setTimeout(() => {
      this.access_token =  this.cbfService.AccessToken
      this.user_id = Number(this.cbfService.currentUserValue)
      this.getUserDetail(this.access_token)
    }, 1200);
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
        // this.phone = result.phone_number;
        // this.role = result.role;
        // let b_url = ApiEndpointsService.DOMAIN.LOCAL_DEV+'/media/'
        let b_url = this.mediaUrl;
        this.profilePic = b_url+result.profile_picture;

      },
      
      error: (err: HttpErrorResponse) => {
        //  this.toaster.warning('Failure fetching user details, kindly refresh', 'Something went wrong')
      }
    })

    this.unsubscribe.push(userSubscr);

  }

	
	togglechatbar() {
		this.toggleChat = !this.toggleChat;
	}
	singleChatWindow() {
		this.toggleSingle = !this.toggleSingle;
	}
    openfullscreen() {
      // Trigger fullscreen
      const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
        mozRequestFullScreen(): Promise<void>;
        webkitRequestFullscreen(): Promise<void>;
        msRequestFullscreen(): Promise<void>;
      };

     if(!this.fullScreenClass) { 
          if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
            docElmWithBrowsersFullScreenFunctions.requestFullscreen();
          } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
            docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
          } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
          } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
            docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
          }

      
     } else {
     
        const docWithBrowsersExitFunctions = document as Document & {
        mozCancelFullScreen(): Promise<void>;
        webkitExitFullscreen(): Promise<void>;
        msExitFullscreen(): Promise<void>;
      };
      if (docWithBrowsersExitFunctions.exitFullscreen) {
        docWithBrowsersExitFunctions.exitFullscreen();
      } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
        docWithBrowsersExitFunctions.mozCancelFullScreen();
      } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        docWithBrowsersExitFunctions.webkitExitFullscreen();
      } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
        docWithBrowsersExitFunctions.msExitFullscreen();
      }

         
     }
    }
 
 


@HostListener("document:fullscreenchange", []) 
fullScreen() {
        this.fullScreenClass = !this.fullScreenClass;
}

    /* getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        const div =  document.getElementById('main-wrapper');
        if(this.screenWidth <768) {
            document.body.setAttribute('data-sidebar-style', 'overlay');
        } else if(this.screenWidth >=768 && this.screenWidth <=1023) {
            document.body.setAttribute('data-sidebar-style', 'mini');
        } else {
            document.body.setAttribute('data-sidebar-style', 'full');
        }
    } */
    

}
