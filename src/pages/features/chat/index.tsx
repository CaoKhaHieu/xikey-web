import { useSelector } from 'react-redux';

import SidebarRight from '@/shared/layouts/sidebar-right';
import ChatHeader from './components/chat-header';
import ChatMain from './components/chat-main';
import TypeMessage from './components/type-message';

const ChatContainer = () => {
  const { apiController } = useSelector((state: any) => state.commonReducer);
  const { isOpenSidebarRight } = apiController;

  return (
    <div className='flex h-full'>
      <div className='h-screen w-full flex flex-col relative'>
        <ChatHeader />
        <ChatMain />
        <TypeMessage />
      </div>
      {
        isOpenSidebarRight && <SidebarRight />
      }
    </div>
  )
}

export default ChatContainer;
