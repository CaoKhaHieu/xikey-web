import ContentLoader from 'react-content-loader';

const ChatSkeleton = (props: any) => {
  return (
    <ContentLoader viewBox="0 0 380 70">
      <circle cx="30" cy="30" r="30" width="48" height="48" />
      <rect x="70" y="5" rx="4" ry="4" width="350" height="20" />
      <rect x="70" y="35" rx="3" ry="3" width="250" height="15" />
    </ContentLoader>
  );
};

export default ChatSkeleton;
