import { Dialog, useDialog } from '..';

import CloseIcon from "@/assets/icons/close.svg?react";

interface ImageDialogProps {
  url: string;
}

const ImageDialog = (props: ImageDialogProps) => {
  const { url } = props;
  const { dialogs, closeCurrentDialog } = useDialog();

  const handleClose = () => {
    closeCurrentDialog(dialogs.length - 1);
  };

  return (
    <Dialog className='rounded-xl !overflow-visible !max-w-7/10 !bg-transparent flex items-center justify-center' showCloseBtn={false}>
      <Dialog.Body className='relative h-full'>
        <button className='absolute -right-3 -top-3 bg-gray8 z-1 rounded-full p-1.5' onClick={handleClose}>
          <CloseIcon />
        </button>
        <a target='_blank' href={url} className='w-full h-full max-h-8/10 overflow-hidden'>
          <img src={url} className='w-auto h-auto max-h-9/10' />
        </a>
      </Dialog.Body>
    </Dialog>
  );
};

export default ImageDialog;
