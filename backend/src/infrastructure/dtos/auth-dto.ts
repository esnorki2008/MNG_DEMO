export interface LoginAuthServiceParams {
  email: string;
  password: string;
}

export interface LoginAuthServiceResponse {
  authToken: string;
}
