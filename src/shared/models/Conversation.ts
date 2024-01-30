import { User } from "./User";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  members: User[];
}

export class Conversation {
  constructor (conversation: any) {
    this.id = conversation.id;
    this.avatar = conversation.avatar;
    this.name = conversation.name;
    this.members = conversation.members
  }
}
