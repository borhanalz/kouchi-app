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
    proPackages: {
      root: `${ROOTS.DASHBOARD}/pro-packages`,
      successfulPayment: `${ROOTS.DASHBOARD}/pro-packages/successful-payment`,
    },
    tickets: {
      root: `${ROOTS.DASHBOARD}/tickets`,
    },
  },
};
