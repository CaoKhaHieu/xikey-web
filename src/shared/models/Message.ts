import { TYPE_MESSAGE } from "../enums";

export interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  type: TYPE_MESSAGE;
  replyMessage: Message;
}

export class Message {
  constructor (message: any) {
    this.id = message.id;
    this.conversationId = message.conversationId;
    this.sender = message.sender;
    this.content = message.content;
    this.isDeleted = message.isDeleted || false;
    this.createdAt = message.createdAt;
    this.updatedAt = message.updatedAt;
    this.type = message.type;
    this.replyMessage = message.replyMessage;
  }
}
