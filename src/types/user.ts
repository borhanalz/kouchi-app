export interface IApiUserGetInfo {
  "success": boolean,
  "user": {
    "userId": string,
    "name": string,
    "mobileNumber": string,
    "lastLoginAt": null | string,
    "refreshToken": string,
    "email": string
  }
}

export interface IUserDetailFormData {
  age: number | null;
  gender: "male" | "female";
  married: boolean;
  militaryStatus: string;
  graduations: {
    university: string;
    degree: string;
    field: string;
    average: number | null;
    graduated: boolean;
  }[];
  languageCertificates: {
    language: string | null;
    totalScore: number | null;
    speakingScore: number | null;
    listeningScore: number | null;
    writingScore: number | null;
    readingScore: number | null;
  }[];
}

export interface IEditUserDetailFormData {
  userData: IUserDetailFormData;
}

export interface IApiEditUserDetail {
  "success": boolean,
  "message": string,
  "updatedDetails": {
    "gender": string,
    "age": number,
    "married": boolean,
    "desiredCountries": [],
    "desiredFields": [],
    "workPriority": string,
    "desiredGrades": [],
    "desiredScholarshipAmount": string,
    "militaryStatus": string,
    "targetUniversities": [],
    "phdInterests": [],
    "selectedPrograms": [],
    "graduations": [],
    "languageCertificates": [],
    "languageLevels": [],
    "scholars": [],
    "workResume": [],
    "children": []
  }
}

export interface IApiUserDetails {
  "success": boolean,
  "details": {
    "userData": IUserDetailFormData,
    "payments": {
      "title": string,
      "amount": 8700000,
      subTitle: string,
      "status": string,
      "type": string,
      "serviceType": string,
      "documentType": string,
      "ticketId": string,
      "authority": string,
      "createdAt": string,
      "description": string,
      "currency": string,
      "paymentMethod": string
    }[],
    "services": []
  }
}
