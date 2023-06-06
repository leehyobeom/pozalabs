export interface Track {
  role: string;
  instruments: string[];
  is_primary: boolean;
}

export interface Request {
  genre: string;
  bpm: number[];
  keys: string[];
  time_signatures: string[];
  tracks: Track[];
}

export interface Sample {
  id: number;
  genre: string;
  role: string;
  instrument: string;
  key: string;
  time_signature: string;
  bpm: number;
}

export interface Response {
  total: number;
  items: Sample[];
}

export interface SampleList {
  total: number;
  items: Sample[];
  has_prev: boolean;
  has_next: boolean;
}
