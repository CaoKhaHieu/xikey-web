import { createContext, ReactElement, useContext, useEffect, useState } from 'react';

interface DeviceProps {
  children: ReactElement;
}

const DeviceContext = createContext({
  isMobile: false,
});

export const useDevice = () => {
  const socketContext = useContext(DeviceContext);
  return socketContext;
};

const DeviceProvider = (props: DeviceProps) => {
  const windowWidthMobile = window.innerWidth <= 768;
  const [isMobile, setIsMobile] = useState(windowWidthMobile);

  useEffect(() => {
    window.addEventListener('resize', () => {
      const windowWidthMobile = window.innerWidth <= 768;
      setIsMobile(windowWidthMobile);
    });
  }, []);

  const data = {
    isMobile,
  };

  return (
    <DeviceContext.Provider value={data}>
      {props.children}
    </DeviceContext.Provider>
  )
}

export default DeviceProvider;
