export type PageType = 'home' | 'assistant' | 'youtube' | 'news' | 'settings';

export interface FocusItem {
  id: string; // Unique identifier for spatial focus matching
  section: 'sidebar' | 'main'; // Top level navigation section
  row: number; // Row index (Y axis) for grid calculations
  col: number; // Column index (X axis) for grid calculations
  label: string; // Assistive/reader/visual text
  actionType: 'navigate' | 'search' | 'play' | 'toggle' | 'action' | 'input';
  actionData?: any; // Context parameters for the trigger action
}

export interface YoutubeVideo {
  youtubeId: string;
  title: string;
  channel: string;
  views: string;
  duration: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  time: string;
  summary: string;
  category: string;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  location: string;
}

export interface SearchResult {
  answer: string;
  facts: string[];
  searchCategory: string;
  suggestedVideos: YoutubeVideo[];
}
