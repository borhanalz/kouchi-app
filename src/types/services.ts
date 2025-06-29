export interface IService {
  "id": string,
  "title": string,
  "subtitle": string,
  "features": string[],
  choices?:{
    _id:string,
    title:string,
    templateId:string,
  }[],
  "prices":{
    "text": string,
    "sale": string,
    "price": string
  }[],
  "buttons": {
      "text": string,
      "action": string,
      "params": {
        "serviceType"?: string,
        "packageType"?: string,
      },
      "disabled": boolean
    }[],
  "userStatus": {
    "hasActiveSubscription": boolean
  }
}

export interface IApiServices {
  "success": true,
  "services": IService[]
}

export interface IPaymentRequest {
  type:string,
  serviceType?:string,
  documentType?:string,
  packageType?:string,
  ticketId?:string,
  templateId?:string
}

export interface IApiPaymentRequest {
  "success": boolean,
  "paymentUrl": string,
  "ticketId": string
}

export interface IPaymentVerifyApi {
  success:boolean,
  status:string,
  message:string
}
