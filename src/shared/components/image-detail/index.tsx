import React from 'react';
import { useDialog } from '../dialog';
import ImageDialog from '../dialog/templates/ImageDialog';


type ImageDetailProps = React.HTMLProps<HTMLImageElement>;

const ImageDetail = (props: ImageDetailProps) => {
  const { src, ...otherProps } = props;

  const { appendDialog } = useDialog();

  const handleClickImage = () => {
    appendDialog(
      <ImageDialog url={src || ''} />
    );
  };

  return (
    <img src={src} onClick={handleClickImage} {...otherProps} >
    </img>
  );
};

export default ImageDetail;
