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
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    newjwt: {
      signIn: `${ROOTS.AUTH}/test/step-phone-number`,
      password:`${ROOTS.AUTH}/test/step-password`,
      otpSignIn: `${ROOTS.AUTH}/test/step-otp-signin`,
      signUp: `${ROOTS.AUTH}/test/sign-up`,
      resetPassword: `${ROOTS.AUTH}/test/step-reset-password`,
    },
    // APP
    app: {
      root: ROOTS.DASHBOARD,
      roadMap: `${ROOTS.DASHBOARD}/road-map`,
      documentList: `${ROOTS.DASHBOARD}/document-list`,
      businessMangement: `${ROOTS.DASHBOARD}/business-management`,
      calender: `${ROOTS.DASHBOARD}/calender`,
      files: `${ROOTS.DASHBOARD}/files`,
      tickets: `${ROOTS.DASHBOARD}/tickets`,
      userInformation: `${ROOTS.DASHBOARD}/user-information`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};
