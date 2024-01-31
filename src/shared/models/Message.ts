export interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  isDeleted: boolean;
}

export class Message {
  constructor (message: any) {
    this.id = message.id;
    this.conversationId = message.conversationId;
    this.sender = message.sender;
    this.content = message.content;
    this.isDeleted = message.isDeleted || false;
  }
}
