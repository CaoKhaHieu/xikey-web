import useIntersectionObserver from '@/shared/hooks/useIntersectionObserver';
import React, { useRef } from 'react';

interface ThumbnailProps {
  className: string;
  url: string;
}

type ImageProps = React.HTMLProps<HTMLImageElement> & ThumbnailProps;

const Thumbnail = (props: ImageProps) => {
  const { url, className, ...otherProps } = props;

  const imageRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserver(imageRef);

  return (
    <div ref={imageRef}>
      {
        isIntersecting ?
        <img
          className={className}
          src={url}
          {...otherProps}
        >
        </img> :
        <div className='bg-back1 w-full min-h-16'>
        </div>
      }
    </div>
  );
};

export default Thumbnail;
