export interface IRoadmapResponse {
  success: boolean;
  message: string;
  data: IRoadmap[];
}

export interface IRoadmap {
  progress: any[]; // You might want to replace 'any' with a more specific type
  currentStep: number;
  customNotes: string;
  template: ITemplate;
}

export interface ITemplate {
  name: string;
  version: string;
  track: string;
  thumbnail: string;
  steps: IStep[];
}

export interface IStep {
  description: IDescription;
  timeRange: ITimeRange;
  _id: string;
  title: string;
  order: number;
  subSteps: ISubStep[];
}

export interface IDescription {
  title: string;
  description: string;
}

export interface ITimeRange {
  start: string; // ISO date string
  end: string; // ISO date string
  description: string;
}

export interface ISubStep {
  description: IDescription;
  requiredDocs: IRequiredDocs;
  lastOpportunity: ILastOpportunity;
  details: IDetails;
  _id: string;
  title: string;
  costs: ICost[];
  summary: string;
  links: ILink[];
}

export interface IRequiredDocs {
  title: string;
  description: string;
  docs: IDoc[];
}

export interface IDoc {
  title: string;
  description: string;
}

export interface ILastOpportunity {
  date: string | null; // ISO date string or null
  title: string;
  description: string;
}

export interface IDetails {
  title: string;
  description: string;
  steps: IDetailStep[];
}

export interface IDetailStep {
  title: string;
  description: string;
}

export interface ICost {
  title: string;
  description: string;
  amount: number;
  currency: string;
}

export interface ILink {
  title: string;
  url: string;
  description: string;
}
