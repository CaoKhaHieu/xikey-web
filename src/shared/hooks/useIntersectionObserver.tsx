import { RefObject, useEffect, useState } from 'react';

const useIntersectionObserver = (elementRef: RefObject<Element>) => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (element.getAttribute('isintersecting') === 'true') {
        setIsIntersecting(true);
      } else {
        element.setAttribute('isintersecting', `${entry.isIntersecting}`);
        setIsIntersecting(entry.isIntersecting);
      }
    });
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);
  
  return {
    isIntersecting,
  };
};

export default useIntersectionObserver;
