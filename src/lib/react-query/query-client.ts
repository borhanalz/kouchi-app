import { isServer, QueryClient } from '@tanstack/react-query';

export let BrowserQueryClient: QueryClient | undefined = undefined;

export function CustomQueryClient (){
  return new QueryClient({
    defaultOptions:{
      queries:{
        staleTime:60*1000
      }
    }
  })
}
export function GetQueryClient(){
  if(isServer){
    return CustomQueryClient()
  }else {
    if(!BrowserQueryClient){
      return BrowserQueryClient=CustomQueryClient();
    }
    return BrowserQueryClient;
  }
}
