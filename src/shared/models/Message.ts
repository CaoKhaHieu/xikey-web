import { TYPE_MESSAGE } from "../enums";
import { Conversation } from "./Conversation";
import { User } from "./User";

export interface Message {
  id: string;
  virtualId: number;
  conversationId: string;
  sender: User;
  content: string;
  isDeleted: boolean;
  // isNew is check message call api first time or receive from socket
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  type: TYPE_MESSAGE;
  replyMessage: Message;
  reactions: {
    [key: number]: User[]
  };
  isSending: boolean;
  report: {
    conversation: Conversation,
    sender: User,
    reason: string,
  }
}

export class Message {
  constructor (message: any) {
    this.id = message.id;
    this.conversationId = message.conversationId;
    this.sender = message.sender;
    this.content = message.content;
    this.isDeleted = message.isDeleted || false;
    this.isNew = message.isNew || false;
    this.createdAt = message.createdAt;
    this.updatedAt = message.updatedAt;
    this.type = message.type;
    this.replyMessage = message.replyMessage;
    this.reactions = message.reactions || [];
    this.isSending = message.isSending || false;
    this.report = message.report && {
      conversation: new Conversation(message.report.conversation),
      sender: new User(message.report.sender), // người gửi tin nhắn bị report
      reason: message.report.reason || '',
    };
  }
}
