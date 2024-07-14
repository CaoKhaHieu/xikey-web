import { useSelector } from 'react-redux';

import Chat from '../chat';
import NoData from './components/no-data';
import ToolNumber from './components/tool-number';

const Home = () => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversation;

  return (
    <div className='h-screen-gmsh w-full flex flex-col'>
      {
        currentConversation.id ? <Chat /> : <NoData />
      }

      <ToolNumber />
    </div>
  );
};

export default Home;
