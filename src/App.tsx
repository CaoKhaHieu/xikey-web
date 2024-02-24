import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import './index.scss';
import Routes from './routes/index.routes';
import { useDialog } from './shared/components/dialog';
import ErrorDialog from './shared/components/dialog/templates/ErrorDialog';
import { getToken } from './shared/utils/utils';
import { getAllUsers, getUser } from './stores/user/action';
import { useSocket } from './shared/contexts/socket-context';
import { User } from './shared/models/User';
import { Conversation } from './shared/models/Conversation';
import { addConversation } from './stores/conversation/action';

function App() {
  const { apiController } = useSelector((state: any) => state.commonReducer);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  const { appendDialog } = useDialog();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { socket} = useSocket();

  useEffect(() => {
    if (user.id) {
      socket.emit('join', user.id);

      socket.on('invite_to_group', (newConversation: Conversation) => {
        dispatch(addConversation(newConversation));
      });
    }
  }, [user]);

  useEffect(() => {
    i18next.changeLanguage('en');
  }, []);

  useEffect(() => {
    if (getToken()) {
      getUserProfile();
      getAllUser();
    }
  }, []);

  useEffect(() => {
    if (apiController.statusCode) {
      const message = apiController.code ? t(`error.${apiController.code}`) : apiController.message;
      appendDialog(<ErrorDialog title='ERROR' statusCode={apiController.statusCode} content={message} />);
    }
  }, [apiController]);

  const getUserProfile = () => {
    dispatch(getUser(null, () => {
    }, () => {
    }))
  };

  const getAllUser = () => {
    dispatch(getAllUsers(() => {
    }, () => {
    }));
  };

  return (
    <>
      <Routes />
      <Toaster
        position="bottom-left"
        toastOptions={{
          className: '',
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  )
}

export default App
