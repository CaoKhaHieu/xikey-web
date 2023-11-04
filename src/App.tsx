import { useEffect } from 'react';
import i18next from 'i18next';
import './index.scss';
import Routes from './routes/index.routes';

function App() {

  useEffect(() => {
    i18next.changeLanguage('en');
  }, []);

  return (
    <>
     <Routes />
    </>
  )
}

export default App
