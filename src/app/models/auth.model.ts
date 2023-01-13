export class AuthModel {
    id?: string;
    refresh?: string;
  
    setAuth(auth: any) {
      this.id = auth.data.id;
      this.refresh = auth.data.tokens.refresh;
    }
  }
  