export const endpoints = Object.freeze({
  AUTH: {
    LOGIN_PASSWORD: 'api/auth/login',
    CHECK_USER_SIGNUP_STATUS:'/api/auth/check-user',
    REGISTER: '/api/auth/register',
    CHANGE_PASSWORD: '/api/auth/update-password',
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
  },
  TICKETS:{
    LIST:'api/tickets/get-by-user',
    GET_BY_ID:'/api/tickets/get-by-id',
    CREATE:"api/tickets/create",
    ADD_RESPONSE:"api/tickets/add-response",
  },
  PROFILE:{
    GET_INFO:'api/user/info',
    DETAIL_INFO:'api/user/details',
  },
  CHAT:{
    CHAT_HISTORY:'chat-history',
    CHAT:'chat'
  },
  SERVICES:{
    LIST:'/api/user/services',
    PAYMENT:'/api/payment/request',
    PAYMENY_VERIFY:'/api/payment/verify',
  },
  ROADMAP:{
    LIST:'api/user/roadmap'
  }
});
