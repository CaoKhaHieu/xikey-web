import React from 'react';
import NoData from './components/no-data';
import ChatHeader from './components/chat-header';
import ChatMain from './components/chat-main';

const Home = () => {
  return (
    <div className='h-screen w-full flex flex-col'>
      {/* <NoData /> */}
      <ChatHeader />
      <ChatMain />
    </div>
  );
};

export default Home;
