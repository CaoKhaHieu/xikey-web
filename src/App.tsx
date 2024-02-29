import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import './index.scss';
import Routes from './routes/index.routes';
import { useDialog } from './shared/components/dialog';
import ErrorDialog from './shared/components/dialog/templates/ErrorDialog';
import { getToken } from './shared/utils/utils';
import { getAllUsers, getUser } from './stores/user/action';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { getTokenVideoCall } from './stores/call/actions';

function App() {
  const [token, setToken] = useState<string>('');
  const { apiController } = useSelector((state: any) => state.commonReducer);

  const { appendDialog } = useDialog();
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
  }, [apiController]);;

  useEffect(() => {
    dispatch(getTokenVideoCall(null, (token: string) => {
      console.log('first')
      setToken(token);
    }, () => {
    }))
  }, [])

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
      {
        token &&
        <LiveKitRoom
          data-lk-theme="default"
          serverUrl={import.meta.env.PUBLIC_LIVEKIT_URL}
          token={token}
          connect={true}
          video={true}
          audio={true}
        >
          <VideoConference />
        </LiveKitRoom>
      }
    </>
  )
}

export default App
