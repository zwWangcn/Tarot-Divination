export interface TarotCard {
  id: string;
  nameEn: string;
  nameZh: string;
  nameJa: string;
  type: 'major';
  imagePlaceholderColor: string;
  element: 'fire' | 'water' | 'air' | 'earth' | 'spirit';
  symbol: string; // Dynamic SVG icon name or custom shape path
  keywordsZh: string[];
  keywordsEn: string[];
  keywordsJa: string[];
  descriptionZh: string;
  descriptionEn: string;
  descriptionJa: string;
}

export interface SelectedCardState {
  card: TarotCard;
  isReversed: boolean;
  isFlipped: boolean;
  position: 'past' | 'present' | 'future';
}

export interface TarotReadingResponse {
  status: 'LOADING' | 'DONE' | 'ERROR';
  request_id: string;
  cards?: {
    id: string;
    nameEn: string;
    nameZh: string;
    nameJa: string;
    isReversed: boolean;
    position: 'past' | 'present' | 'future';
  }[];
  interpretation?: string; // Markdown formatted string from backend AI
  error?: string;
}
