import { useTranslation } from 'react-i18next';
import { Dialog } from '..';
import Button from '../../button';

interface ConfirmDialogProps {
  title: string;
  content: string;
  onClick: () => void;
  close?: () => void;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const  { title, content, close, onClick, ...otherProps } = props;
  const { t } = useTranslation();

  const handleClose = () => {
    close && close();
  };

  const handleClick = () => {
    onClick();
    handleClose();
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg' closeRight close={handleClose}>
      <Dialog.Header className='text-4.25 font-semibold'>
        {title}
      </Dialog.Header>
      <Dialog.Body className='text-3.2 pt-2 whitespace-break'>
        {content}
      </Dialog.Body>
      <Dialog.Footer className='pt-5 flex justify-end space-x-4'>
        <Button
          className='border border-gray2 rounded-md px-10 py-1.5 hover:bg-gray8'
          onClick={handleClose}
        >
          {t('cancel')}
        </Button>
        <Button
          className='border border-gray2 rounded-md px-10 py-1.5 hover:bg-primaryHover hover:text-white hover:border-primaryHover'
          onClick={handleClick}
        >
          {t('ok')}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
};

export default ConfirmDialog;
