export interface LoginAuthServiceParams {
  email: string;
  password: string;
}

export interface LoginAuthServiceResponse {
  authToken: string;
}

export interface ValidateAuthServiceParams {
  userId: string;
}

export interface ValidateAuthServiceResponse {
  authToken: string;
}
