export interface IService {
  "id": string,
  "title": string,
  "subtitle": string,
  "features": string[],
  "prices": {
    "regular": number,
    "sale": number,
    "discount": number
  },
  "buttons": {
      "text": string,
      "action": string,
      "params": {
        "serviceType": string,
        "packageType": string,
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
