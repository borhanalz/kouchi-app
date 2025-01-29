// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
      signIn: `${ROOTS.AUTH}/step-phone-number`,
      password:`${ROOTS.AUTH}/step-password`,
      otpSignIn: `${ROOTS.AUTH}/step-otp-signin`,
      signUp: `${ROOTS.AUTH}/sign-up`,
      resetPassword: `${ROOTS.AUTH}/step-reset-password`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    roadMap:{
      root:`${ROOTS.DASHBOARD}/road-map`,
    }
  },
};
