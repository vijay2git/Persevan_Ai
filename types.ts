
export enum AppView {
  PERSEVAN = 'persevan',
  HISTORY = 'history'
}

export interface MessagePart {
  text?: string;
  image?: string; // base64
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string | MessagePart[];
  timestamp: number;
  isThinking?: boolean;
}
