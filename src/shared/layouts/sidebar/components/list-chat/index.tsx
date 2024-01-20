import { IUser } from "@/shared/models/User";
import ChatItem from "../chat-item";

const data: IUser[] = [
  {
    id: "1",
    email: "hieu.cao@supremetech.vn",
    firstName: "Hieu Cao",
    lastName: "Hieu Cao",
    displayName: "Hieu Cao K. cao kha hieu dai them nuaw nef",
    role: "user",
    avatar: "https://picsum.photos/536/354",
    online: true,
    gender: "male",
    dob: "Hieu Cao",
    phone: "0336816276",
  },
  {
    id: "2",
    email: "hieu.cao@supremetech.vn",
    firstName: "Hieu Cao",
    lastName: "Hieu Cao",
    displayName: "Hieu Cao K.",
    role: "user",
    avatar: "https://picsum.photos/300/300",
    online: true,
    gender: "male",
    dob: "Hieu Cao",
    phone: "0336816276",
  },
  {
    id: "3",
    email: "hieu.cao@supremetech.vn",
    firstName: "Hieu Cao",
    lastName: "Hieu Cao",
    displayName: "Hieu Cao K.",
    role: "user",
    avatar: "https://picsum.photos/350/350",
    online: true,
    gender: "male",
    dob: "Hieu Cao",
    phone: "0336816276",
  },
  {
    id: "4",
    email: "hieu.cao@supremetech.vn",
    firstName: "Hieu Cao",
    lastName: "Hieu Cao",
    displayName: "Hieu Cao K.",
    role: "user",
    avatar: "https://picsum.photos/400/400",
    online: true,
    gender: "male",
    dob: "Hieu Cao",
    phone: "0336816276",
  },
  {
    id: "5",
    email: "hieu.cao@supremetech.vn",
    firstName: "Hieu Cao",
    lastName: "Hieu Cao",
    displayName: "Hieu Cao K.",
    role: "user",
    avatar: "https://picsum.photos/100/100",
    online: true,
    gender: "male",
    dob: "Hieu Cao",
    phone: "0336816276",
  },
];

const ListChat = () => {
  return (
    <div className="flex flex-col mt-2">
      {data.map((user: IUser) => (
        <ChatItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default ListChat;
