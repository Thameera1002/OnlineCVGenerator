/** Dates entered via <input type="month"> are stored as "YYYY-MM". */
export type YearMonth = string;

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  linkedin: string;
  website: string;
  /** Resized JPEG data URL, kept small so it fits in localStorage. */
  photo: string;
  /** "YYYY-MM-DD" */
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  religion: string;
  nicNumber: string;
  passportNumber: string;
  visaStatus: string;
  workAuthorization: string;
  drivingLicense: string;
  noticePeriod: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  employer: string;
  location: string;
  startDate: YearMonth;
  endDate: YearMonth;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  qualification: string;
  institution: string;
  location: string;
  startDate: YearMonth;
  endDate: YearMonth;
  grade: string;
  description: string;
}

/** School-leaving exams, e.g. Sri Lankan G.C.E. O/L and A/L. */
export interface SchoolExam {
  id: string;
  exam: string;
  year: string;
  school: string;
  results: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string;
}

export interface Language {
  id: string;
  language: string;
  level: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: YearMonth;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
}

export interface Declaration {
  text: string;
  place: string;
  /** "YYYY-MM-DD" */
  date: string;
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  schoolExams: SchoolExam[];
  skills: SkillGroup[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  references: Reference[];
  interests: string;
  declaration: Declaration;
}

/** Keys of CVData that hold arrays of `{ id }` items. */
export type ListKey = {
  [K in keyof CVData]: CVData[K] extends { id: string }[] ? K : never;
}[keyof CVData];

export type ListItem<K extends ListKey> = CVData[K][number];

export type SectionKey =
  | "personalDetails"
  | "summary"
  | "experience"
  | "education"
  | "schoolExams"
  | "skills"
  | "languages"
  | "certifications"
  | "projects"
  | "interests"
  | "references"
  | "declaration";

/** Personal fields whose use differs by region (privacy law and local custom). */
export type RegionalFieldKey =
  | "photo"
  | "address"
  | "dateOfBirth"
  | "gender"
  | "maritalStatus"
  | "nationality"
  | "religion"
  | "nicNumber"
  | "passportNumber"
  | "visaStatus"
  | "workAuthorization"
  | "drivingLicense"
  | "noticePeriod";

export type TemplateId = "classic" | "modern";
