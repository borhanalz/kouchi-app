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

export interface IUserDetailFormData {
  age: number;
  gender: "male" | "female";
  married: boolean;
  militaryStatus: string;
  graduations: {
    university: string;
    degree: string;
    field: string;
    GPA: number;
    graduated: boolean;
  }[];
  languageCertificates: {
    language: string;
    totalScore: number;
    speakingScore: number;
    listeningScore: number;
    writingScore: number;
    readingScore: number;
  }[];
}

export interface IEditUserDetailFormData {
  userData:IUserDetailFormData;
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
    "payments": [],
    "services": []
  }
}
