import { createContext, FunctionComponent, useContext, useState } from 'react';
import classNames from 'classnames';

import './style.scss';

interface ILoadingProps {
  className?: string;
}

const LoadingContext = createContext({
  loading: false,
  setLoading: (_loading: boolean) => {}
});

export const useLoading = () => useContext(LoadingContext);

export const Loading: FunctionComponent<ILoadingProps> = ({ className }) => {
  return (
    <div className={classNames('lds-ripple', className)}><div></div><div></div></div>
  );
};

const LoadingProvider: FunctionComponent = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{
      loading,
      setLoading
    }}>
      { loading && <div className='loading-wrapper'>
        <Loading className='global' />
      </div> }
      { children }
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
