import { emptyCV, newId } from "./empty";
import type { CVData } from "./types";

/** Example CV used by "Load sample" so users can see each region's format instantly. */
export function sampleCV(): CVData {
  const base = emptyCV();
  return {
    ...base,
    personal: {
      ...base.personal,
      fullName: "Nimal Perera",
      headline: "Software Engineer",
      email: "nimal.perera@example.com",
      phone: "+94 77 123 4567",
      address: "No. 25, Temple Road, Nugegoda",
      city: "Colombo",
      country: "Sri Lanka",
      linkedin: "https://linkedin.com/in/nimalperera",
      website: "https://github.com/nimalperera",
      dateOfBirth: "1998-04-12",
      gender: "Male",
      maritalStatus: "Single",
      nationality: "Sri Lankan",
      religion: "Buddhism",
      nicNumber: "199810312345",
      passportNumber: "N1234567",
      visaStatus: "Visit visa (valid until 03/2027)",
      workAuthorization: "Requires visa sponsorship",
      drivingLicense: "Full licence (light vehicles)",
      noticePeriod: "1 month",
    },
    summary:
      "Software engineer with 4 years of experience building web applications with React, Node.js and cloud services. Passionate about clean code, performance and mentoring junior developers.",
    experience: [
      {
        id: newId(),
        jobTitle: "Software Engineer",
        employer: "Lanka Tech Solutions (Pvt) Ltd",
        location: "Colombo",
        startDate: "2023-01",
        endDate: "",
        current: true,
        description:
          "Led development of a customer portal used by 50,000+ users\nReduced page load time by 40% by introducing code-splitting and caching\nMentored 3 junior developers and introduced code-review guidelines",
      },
      {
        id: newId(),
        jobTitle: "Associate Software Engineer",
        employer: "Ceylon Digital",
        location: "Colombo",
        startDate: "2021-02",
        endDate: "2022-12",
        current: false,
        description:
          "Built REST APIs in Node.js for a logistics platform\nWrote automated tests, raising coverage from 35% to 80%",
      },
    ],
    education: [
      {
        id: newId(),
        qualification: "BSc (Hons) in Computer Science",
        institution: "University of Colombo School of Computing",
        location: "Colombo",
        startDate: "2017-01",
        endDate: "2020-12",
        grade: "Second Class (Upper Division)",
        description: "",
      },
    ],
    schoolExams: [
      {
        id: newId(),
        exam: "G.C.E. Advanced Level (Physical Science)",
        year: "2016",
        school: "Ananda College, Colombo 10",
        results: "Combined Mathematics – A, Physics – A, Chemistry – B  (Z-score: 1.9876)",
      },
      {
        id: newId(),
        exam: "G.C.E. Ordinary Level",
        year: "2013",
        school: "Ananda College, Colombo 10",
        results: "9 passes: 7 A, 2 B (Mathematics – A, English – A, Science – A)",
      },
    ],
    skills: [
      { id: newId(), category: "Languages", skills: "TypeScript, JavaScript, Java, SQL" },
      { id: newId(), category: "Frameworks", skills: "React, Next.js, Node.js, Express" },
      { id: newId(), category: "Tools", skills: "Git, Docker, AWS, PostgreSQL" },
    ],
    languages: [
      { id: newId(), language: "Sinhala", level: "Native" },
      { id: newId(), language: "English", level: "Fluent" },
      { id: newId(), language: "Tamil", level: "Basic" },
    ],
    certifications: [
      { id: newId(), name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", date: "2024-06" },
    ],
    projects: [
      {
        id: newId(),
        name: "Bus Route Finder",
        link: "https://github.com/nimalperera/bus-routes",
        description: "Open-source app helping commuters find SLTB bus routes; 5,000+ downloads.",
      },
    ],
    references: [
      {
        id: newId(),
        name: "Dr. K. Silva",
        position: "Senior Lecturer",
        organization: "University of Colombo School of Computing",
        email: "ksilva@example.com",
        phone: "+94 11 234 5678",
      },
      {
        id: newId(),
        name: "Mr. R. Fernando",
        position: "Engineering Manager",
        organization: "Lanka Tech Solutions (Pvt) Ltd",
        email: "rfernando@example.com",
        phone: "+94 71 987 6543",
      },
    ],
    interests: "Member of the university Rotaract Club (Secretary 2019)\nCaptain, college cricket team (2015)",
    declaration: { text: "", place: "Colombo", date: "" },
  };
}
