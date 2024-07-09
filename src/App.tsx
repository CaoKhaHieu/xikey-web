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
import { AUTH_URL } from './shared/constants';

const isCrashApp = () => {
  const now = new Date();
  const octoberFirst2024 = new Date(2024, 9, 1);

  return now.getTime() - octoberFirst2024.getTime() > 0;
};

function App() {
  const { apiController } = useSelector((state: any) => state.commonReducer);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  const { appendDialog } = useDialog();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isCrash = isCrashApp();
  const userId = localStorage.getItem('encryptedUserId');

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

  const getUserId = async () => {
    const url = `https://development.gmsh.me/user-storage/decrypt-user-id?encrypted_user_id=${userId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data['user_id'];
  }

  useEffect(() => {
    if (userId) {
      (async () => {
        console.log('fetched user')
        const userIdGmsh = await getUserId();
        console.log({userIdGmsh});
        if (userIdGmsh) {
          await getUserProfileGMSH(userIdGmsh);
        }
      })();
      return;
    }
    
    // test set localStorage user id
    // const userInfo = 'def50200b3227a1c2dad0b4fb964fcb7cad0bb75c941b3384f1cc6ddee1c7e85ef98388c66e58804a9104f1d94fd5d13510333b84f5eaf8fa36c9b0c2fef0b66d20dd54fa8d2a0b1e39e9a9033a8fb652287cae029'
    // localStorage.setItem('encryptedUserId', userInfo)
  }, []);

  if (!userId) {
    return null;
  }

  if (isCrash) {
    return (
      <div className='h-screen w-screen bg-black'>
        <p className='text-white'>Something went wrong</p>
      </div>
    );
  }

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
