
export type AppState = 'API_KEY' | 'MAIN_APP' | 'PROCESSING' | 'RESULTS';

export interface EventDetails {
  schoolName: string;
  eventDate: string;
  headerColor: string;
  numberOfPhotos: number;
}

export interface ResultData {
  collageUrl: string;
  viralityText: string;
}
