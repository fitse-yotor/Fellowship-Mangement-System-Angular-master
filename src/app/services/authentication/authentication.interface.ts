export interface TokenInterface {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponseInterface {
    token: string;
    message: string;
}
