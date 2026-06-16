export interface ExtractedApplication {
  company: string;
  role: string;
  salary: string | null;
  techStack: string[];
  notes: string;
  url: string;
}
export interface ExtractJobOfferRequest {
  url: string;
}
