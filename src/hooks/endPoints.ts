  export const endpoints = Object.freeze({
    AUTH:{
      LOGIN_PASSWORD:"api/auth/login",
      CHECK_USER_SIGNUP_STATUS:(mobileNumber:string)=>`/api/auth/check-user?mobileNumber=${mobileNumber}`
    }
  });
