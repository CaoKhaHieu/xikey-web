import ChatHeader from './components/chat-header';
import ChatLinks from './components/chat-links';
import ChatMain from './components/chat-main';
import TypeMessage from './components/type-message';

const ChatContainer = () => {
  return (
    <div className='h-screen w-full flex flex-col'>
      <ChatHeader />
      <ChatLinks />
      <ChatMain />
      <TypeMessage />
    </div>
  )
}

export default ChatContainer;
