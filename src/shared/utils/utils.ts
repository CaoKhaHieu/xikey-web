import * as yup from 'yup';
import toast from 'react-hot-toast';

import { PASSWORD_PATTERN, VALIDATE_LENGTH } from '../constants';

export const urlify = (content: string) => {
  if (!content) {
    return '';
  }
  let replacedText;

  //URLs starting with http://, https://, or ftp://
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = content.replace(replacePattern1, '<a class=\'message-content-link text-blue\' href="$1" target="_blank">$1</a>');

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a class=\'message-content-link text-blue\' href="http://$2" target="_blank">$2</a>');

  //Change email addresses to mailto:: links.
  const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(replacePattern3, '<a class=\'message-content-link text-blue\' href="mailto:$1">$1</a>');

  return replacedText;
};

export const formValidateResolver = (arrFields: string[]) => {
  const fieldsValidate: any = {
    name: yup.string().trim().required('error.name_required').min(VALIDATE_LENGTH.MIN_LENGTH, 'error.name_length').max(VALIDATE_LENGTH.MAX_NAME, 'error.name_length'),
    email: yup.string().trim()
      .required('error.email_required')
      .email('error.email_invalid')
      .test('maxLength', 'error.email_invalid', (val: any) => val.length <= VALIDATE_LENGTH.MAX_EMAIL),
    password: yup.string().trim()
      .required('error.password_required')
      .test('length', 'error.password_length', (val: any) => val.length >= VALIDATE_LENGTH.MIN_LENGTH && val.length <= VALIDATE_LENGTH.MAX_PASSWORD)
      .matches(PASSWORD_PATTERN, 'error.password_invalid'),
    confirmPassword: yup.string().trim()
      .required('error.confirm_password_required')
      .oneOf([yup.ref('password'), null], 'error.confirm_password_match'),
  };

  // Convert string array to key and get value from fieldsValidate
  const validate = arrFields.reduce((accumulator, value) => {
    return { ...accumulator, [value]: fieldsValidate[value] };
  }, {});

  return yup.object(validate).required();
};

export const showToast = (message: string) => toast(message);
