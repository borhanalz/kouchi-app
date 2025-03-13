export interface IApiUserGetInfo {
  "success": boolean,
  "user": {
    "userId": string,
    "name": string,
    "mobileNumber": string,
    "lastLoginAt": null|string,
    "refreshToken": string,
    "email": string
  }
}
