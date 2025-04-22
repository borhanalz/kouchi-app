export interface IApiCheckUser {
  success: boolean;
  message: string;
  exists?: boolean;
}

export interface IApiSendOtp {
  success: boolean;
  message: string;
  action: string;
}

export interface IApiLogin {
  "success": boolean,
  "message": string,
  "data": {
    "token": string,
    "user": {
      "id": string,
      "mobileNumber": string,
      "name": string
    }
  }
}


export interface ISendOtpFormData {
  mobileNumber: string;
  otpType: 'reset' | 'login';
}
