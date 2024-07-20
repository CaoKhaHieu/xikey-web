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
import { getUser, getUserGMSH } from './stores/user/action';
import { User } from './shared/models/User';

function App() {
  const { apiController } = useSelector((state: any) => state.commonReducer);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  const { appendDialog } = useDialog();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    i18next.changeLanguage('en');
  }, []);

  useEffect(() => {
    if (getToken()) {
      getUserProfile();
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

  // GMSH
  const getUserProfileGMSH = (userId: string) => {
    dispatch(getUserGMSH(userId, () => {
    }, () => {
    }))
  };

  useEffect(() => {
    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.data);
        if (data.userId) {
          getUserProfileGMSH(data.userId);
        }
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <Routes />
      <Toaster
        position="bottom-right"
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
