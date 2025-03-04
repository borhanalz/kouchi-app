export interface IApiCheckUser {
  success: boolean;
  message: string;
  hasPassword?: boolean;
}

export interface IApiSendOtp {
  success: boolean;
  message: string;
  action: string;
}

export interface IApiResetPassword {
  success: boolean;
  message: string;
}

export interface IApiOtpLogin {
  token: string;
  refreshToken: string;
}

export interface IApiRegister {
  "success": boolean,
  "message": string,
  "token": string
}
