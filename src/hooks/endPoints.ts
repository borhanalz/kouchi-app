export const endpoints = Object.freeze({
  AUTH: {
    LOGIN_PASSWORD: 'api/auth/login',
    CHECK_USER_SIGNUP_STATUS: (mobileNumber: string) =>
      `/api/auth/check-user?mobileNumber=${mobileNumber}`,
    REGISTER: '/api/auth/register',
    CHANGE_PASSWORD: '/api/auth/update-password',
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
  },
  TICKETS:{
    LIST:'api/tickets/get-by-user'
  }
});
