export interface IChat {
  "key": number,
  "role": string,
  "content": string,
  "showPlans"?:boolean,
  "status": string,
  "timestamp": string,
  "flow": {},
  "_id":string,
  options?:string[]
}

export interface IApiChatHistory {
  chats:IChat[]
}

export interface IApiChat {
  "status": string,
  "info": string
}

export interface IChatFormData {
  message:string;
}
