import { useEffect } from 'react';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import './index.scss';
import Routes from './routes/index.routes';
import { useDialog } from './shared/components/dialog';
import ErrorDialog from './shared/components/dialog/templates/ErrorDialog';
import { useTranslation } from 'react-i18next';

function App() {
  const { apiController } = useSelector((state: any) => state.commonReducer);

  const { appendDialog } = useDialog();
  const { t } = useTranslation();

  useEffect(() => {
    i18next.changeLanguage('en');
  }, []);

  useEffect(() => {
    if (apiController.statusCode) {
      const message = t(`error.${apiController.code}`) || apiController.message;
      appendDialog(<ErrorDialog title='ERROR' content={message} />);
    }
  }, [apiController]);

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
