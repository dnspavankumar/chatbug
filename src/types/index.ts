export interface Room {
  id: string;
  name: string;
  userCount: number;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}