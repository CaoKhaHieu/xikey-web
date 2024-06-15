import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Dialog } from '..';
import Button from '../../button';
import Input from '../../input';

import { Conversation, Link } from '@/shared/models/Conversation';
import { formValidateResolver } from '@/shared/utils/utils';
import { createLink, selectConversation, updateLink } from '@/stores/conversation/action';

interface LinksDialogProps {
  onClick: () => void;
  close?: () => void;
  link?: Link;
}

export type Inputs = {
  title: string,
  link: string,
};

const schema = formValidateResolver(['title', 'link']);

const LinksDialog = (props: LinksDialogProps) => {
  const  { close, onClick, link, ...otherProps } = props;

  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation }: { currentConversation: Conversation } = conversation;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      link: ''
    },
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    if (link && link.id) {
      reset({
        title: link.title,
        link: link.link
      })
    }
  }, [link]);

  const handleClose = () => {
    close && close();
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (link && link.id) {
      dispatch(updateLink({ ...data, conversationId: currentConversation.id, linkId: link.id }, (conversationUpdated: Conversation) => {
        dispatch(selectConversation({ ...currentConversation, links: conversationUpdated.links }));
        handleClose();
      }, () => {}));
    } else {
      dispatch(createLink({ ...data, conversationId: currentConversation.id }, (conversationUpdated: Conversation) => {
        dispatch(selectConversation({ ...currentConversation, links: conversationUpdated.links }));
        handleClose();
      }, () => {}));
    }

    onClick();
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg' closeRight close={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
        <Dialog.Header className='text-4.25 font-semibold'>
          {
            t(link?.id ? 'edit_link' : 'links_management')
          }
        </Dialog.Header>
        <Dialog.Body className='flex flex-col space-y-4 text-3.2 pt-2 whitespace-break'>
          <Input variant='auth' type='title' label='Title' {...register('title')} min={6} max={30} error={errors.title?.message} />
          <Input variant='auth' type='link' label='Link' {...register('link')} error={errors.link?.message} />
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
            {t(link?.id ? 'save' : 'add')}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog>
  );
};

export default LinksDialog;
