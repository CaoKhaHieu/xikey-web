import { useSelector } from 'react-redux';

import Chat from '../chat';
import NoData from './components/no-data';

const Home = () => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversation;

  return (
    <div className='h-screen w-full flex flex-col'>
      {
        currentConversation.id ? <Chat /> : <NoData />
      }
    </div>
  );
};

export default Home;
