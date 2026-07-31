export interface SupportContext {
  language: string;
  isGuest: boolean;
}

export interface SupportRequest {
  subject: string;
  fields: Record<string, string>;
}
