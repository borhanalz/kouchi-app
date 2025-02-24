const useEndPoints = ()=>{
  const endpoints = Object.freeze({
    AUTH:{
      SIGNIN:"api/auth/login"
    }
  });
  return endpoints
}
export default useEndPoints;
