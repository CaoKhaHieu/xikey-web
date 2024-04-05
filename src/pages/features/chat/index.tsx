import ChatHeader from './components/chat-header';
import ChatMain from './components/chat-main';
import PinMessages from './components/pin-messages';
import TypeMessage from './components/type-message';

const ChatContainer = () => {
  return (
    <div className='h-screen w-full flex flex-col relative'>
      <ChatHeader />
      <PinMessages />
      <ChatMain />
      <TypeMessage />
    </div>
  )
}

export default ChatContainer;
