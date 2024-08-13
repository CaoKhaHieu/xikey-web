import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';

import { Dialog } from '..';
import Button from '../../button';
import Textarea from '../../textarea';
import { showToast } from '@/shared/utils/utils';
import { reportMessage } from '@/stores/message/action';

interface ReportMessageDialogProps {
  conversationId: string;
  messageId: string;
  onClick: () => void;
  close?: () => void;
}

const ReportMessageDialog = (props: ReportMessageDialogProps) => {
  const  { close, messageId, conversationId, onClick, ...otherProps } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClose = () => {
    close && close();
  };

  const onSubmit = (data: any) => {
    if (!data.reason) {
      return;
    }
    const body = {
      messageId,
      reason: data.reason,
    };
    dispatch(reportMessage(body, () => {
      showToast(t('report_message_success'));
      handleClose();
    }, () => {}));
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg' closeRight close={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Dialog.Header className='text-4.25 font-semibold'>
          {t('report')}
        </Dialog.Header>
        <Dialog.Body className='text-3.2 pt-4 whitespace-break'>
          <Controller
            control={control}
            name='reason'
            render={({
              field: { onChange, onBlur, value }
            }) => (
              <Textarea
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                maxLength={100}
              />
            )}
          />
        </Dialog.Body>
        <Dialog.Footer className='pt-5 flex justify-end space-x-4'>
          <Button
            type='button'
            className='border border-gray2 rounded-md px-10 py-1.5 hover:bg-gray8'
            onClick={handleClose}
          >
            {t('cancel')}
          </Button>
          <Button
            type='submit'
            className='border border-gray2 rounded-md px-10 py-1.5 hover:bg-primaryHover hover:text-white hover:border-primaryHover'
          >
            {t('ok')}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog>
  );
};

export default ReportMessageDialog;
