import { Message } from "./Message";
import { User } from "./User";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  members: User[];
  lastMessage: Message;
  updatedAt: string;
  isGroup: boolean;
  isCloud: boolean;
  ownerId: string;
}

export class Conversation {
  constructor (conversation: any) {
    this.id = conversation.id;
    this.avatar = conversation.avatar;
    this.name = conversation.name;
    this.members = conversation.members;
    this.lastMessage = conversation.lastMessage;
    this.updatedAt = conversation.updatedAt;
    this.isGroup = conversation.isGroup || this.members?.length > 2;
    this.isCloud = conversation.isCloud || false;
    this.ownerId = conversation.ownerId || '';
  }
}
