import { AuthModel } from "./auth.model";

export class UserModel extends AuthModel {
    password?: string;
    full_name?: string;
    email?: string;
    profile_pic?: string;
    is_staff?: boolean;
    tokens?: {
      refresh?: string;
      access?: string;
    };
    phone_number?: string;
   
    setUser(_user: unknown) {
      const user = _user as UserModel;
      this.id = user.id;
      this.password = user.password || '';
      this.full_name = user.full_name || '';
      this.email = user.email || '';
      this.profile_pic = user.profile_pic || './assets/media/avatars/blank.png';
    //   this.role = user.role || '';
      // this.occupation = user.occupation || '';
      // this.companyName = user.companyName || '';
      // this.phone_number = user.phone_number || '';
      // this.address = user.address;
      // this.socialNetworks = user.socialNetworks;
      // this.username = user.username || '';
    }
  }

  export interface NewPassword {
    password: string;
    token: string;
    uidb64: string;
  }
  