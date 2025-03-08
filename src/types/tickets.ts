export interface ITicketResponse {
    "responderType": string,
    "responderName": string,
    "text": string,
    "attachments": any[],
    "createdAt": string,
     contentType: string;
}

export interface ITicketFormData {
  "_id"?: string,
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
  id?:number|undefined,
  "__v": number
}

export interface IApiTicketsList {
  "success": boolean,
  "tickets": ITicketFormData[],
  totalCount:number
}

export interface IApiGetTicket {
  success: boolean,
  ticket:ITicketFormData,
}

export interface IApiCreateTicket {
  "success": boolean,
  "message": string,
  "ticketId": number
}

export interface ICreateTicketFormData {
  "title" : string,
  "description": string,
  "category" : string,
  "priority" : string,
  "requiresPayment" : boolean,
  "price": number
}

export interface IAddResponseFormData {
  "ticketId": number,
  "responderType": string,
  "responderName": string,
  "text": string,
  "attachments": any
}

export interface IApiAddResponse{
  "success": boolean,
  "message": string
}
