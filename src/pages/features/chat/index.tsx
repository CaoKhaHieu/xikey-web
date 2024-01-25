import ChatHeader from './components/chat-header';
import ChatMain from './components/chat-main';
import TypeMessage from './components/type-message';

const ChatContainer = () => {
  return (
    <div className='h-screen w-full flex flex-col'>
      <ChatHeader />
      <ChatMain />
      <TypeMessage />
    </div>
  )
}

export default ChatContainer;
