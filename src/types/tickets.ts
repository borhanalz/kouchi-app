export interface ITicketResponse {
    "responderType": string,
    "responderName": string,
    "text": string,
    "attachments": any[],
    "createdAt": string
}

export interface ITicketFormData {
  "_id": string,
  "userId": string,
  "title": string,
  "category": string,
  "description": string,
  "sender": string,
  "status": string,
  "attachments": any[],
  "priority": string,
  "assignedAgents":any [],
  "requiresPayment": boolean,
  "paymentStatus": string,
  "price": number,
  "transactionId": string,
  "closedAt": string,
  "assignmentHistory": any[],
  "responses": ITicketResponse[],
  "createdAt": string,
  "updatedAt": string,
  "__v": number
}

export interface IApiTicketsList {
  "success": true,
  "tickets": ITicketFormData[]
}
