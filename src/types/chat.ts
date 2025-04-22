export interface IChat {
  "key": number,
  "role": string,
  "content": string,
  "status": string,
  "timestamp": string,
  "flow": {},
  "_id":string
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
