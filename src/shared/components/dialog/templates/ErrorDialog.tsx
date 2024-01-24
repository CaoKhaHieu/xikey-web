import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Dialog } from '..';
import Button from '../../button';
import { logout } from '@/stores/auth/actions';
import { getRefreshToken, removeToken } from '@/shared/utils/utils';

interface ErrorDialogOptions {
  title: string;
  content: string;
  actionText?: string;
  statusCode?: number;
  close?: () => void;
  afterClose?: () => void;
}

const ErrorDialog = (props: ErrorDialogOptions) => {
  const { title, content, close, actionText, afterClose, statusCode, ...otherProps } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleClose = () => {
    close && close();
    afterClose && afterClose();
  };

  useEffect(() => {
    return () => {
      if (statusCode === 401) {
        const refreshToken = {
          refreshToken: getRefreshToken()
        };
        dispatch(logout(refreshToken, () => {
          removeToken();
          window.location.reload();
        }, () => {
        }));
      }
    };
  }, [statusCode]);

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg' closeRight close={handleClose}>
      <Dialog.Header className='text-4.25 text-red font-semibold'>
        {title}
      </Dialog.Header>
      <Dialog.Body className='text-3.25 text-white pt-2 whitespace-break'>
        {content}
      </Dialog.Body>
      <Dialog.Footer className='pt-5 flex justify-end'>
        <Button
          className='border border-gray2 rounded-md text-white px-10 py-1.5'
          onClick={handleClose}
        >
          {actionText ? actionText : t('ok')}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
};

export default ErrorDialog;
