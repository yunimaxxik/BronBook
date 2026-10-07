export interface Message {
  id: number;
  supportRequestId: number;
  authorId: number;
  text: string;
  sentAt: string;
  readAt: string | null;
  author?: {
    id: number;
    name: string;
  };
}
