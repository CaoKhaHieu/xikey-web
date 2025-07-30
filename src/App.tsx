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
import { getAllUsers, getUser, getUserGMSH } from './stores/user/action';
import { User } from './shared/models/User';
import { AUTH_URL } from './shared/constants';

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
    if (!user.id) {
      return;
    }
    getAllUser();
  }, [user.id]);

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

  const getAllUser = () => {
    dispatch(getAllUsers(() => {
    }, () => {
    }));
  };

  // GMSH
  const getUserProfileGMSH = (userId: string) => {
    dispatch(getUserGMSH(userId, () => {
    }, () => {
    }))
  };

  const getUserId = async () => {
    const userIdLocal = localStorage.getItem('encryptedUserId');
  
    if (!userIdLocal) {
      return null;
    }
    const url = `${AUTH_URL}${userIdLocal}?t=${Date.now()}`;
    const response = await fetch(url, {
      headers: {
        'crossOrigin': 'anonymous'
      }
    });
    const userId = await response.json();
    return userId;
  }

  useEffect(() => {
    const userId = localStorage.getItem('encryptedUserId');
    if (userId) {
      (async () => {
        // const data = await getUserId();
        const userInfo = await getUserProfileGMSH('1');
        console.log({ userInfo });
      })()
      return;
    }
    const userInfo = 'def50200afb3d1c80201661cdd639d789ed8df18ded46ee9d2ef058c2a1108102eae7e09bc04c2885ec0f11328d46d089009c9c872f2ba26a378ad952a56fd697e3f5eda685ff2a3ff3884530e35c857aeee39f71b';
    localStorage.setItem('encryptedUserId', userInfo)
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
