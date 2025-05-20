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
    password: `${ROOTS.AUTH}/step-password`,
    otpSignIn: `${ROOTS.AUTH}/step-otp-signin`,
    signUp: `${ROOTS.AUTH}/signup`,
    resetPassword: `${ROOTS.AUTH}/step-reset-password`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    roadMap: {
      root: `${ROOTS.DASHBOARD}/road-map`,
      countryRoadMap: (countryName: string) => `${ROOTS.DASHBOARD}/road-map/${countryName}`,
      prepareDocuments: (countryName: string) =>
        `${ROOTS.DASHBOARD}/road-map/${countryName}/prepare-documents`,
    },
    documents: {
      root: `${ROOTS.DASHBOARD}/documents`,
    },
    services: {
      root: `${ROOTS.DASHBOARD}/services`,
      successfulPayment: `${ROOTS.DASHBOARD}/services/pro-services/successful-payment`,
      proServices:`${ROOTS.DASHBOARD}/services/pro-services`,
      userServices: `${ROOTS.DASHBOARD}/services/user-services`,
      userServicesDetails:(id:string)=>`${ROOTS.DASHBOARD}/services/user-services/${id}`
    },
    tickets: {
      root: `${ROOTS.DASHBOARD}/tickets`,
      create: `${ROOTS.DASHBOARD}/tickets/create`,
      details:(id:string)=>`${ROOTS.DASHBOARD}/tickets/${id}`
    },
    profile:{
      root:`${ROOTS.DASHBOARD}/profile/edit-profile`,
    },
  },
};
