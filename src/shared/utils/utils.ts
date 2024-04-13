import * as yup from 'yup';
import toast from 'react-hot-toast';
import i18n from './i18n.ts';

import { PASSWORD_PATTERN, VALIDATE_LENGTH } from '../constants';

export const urlify = (content: string, isCurrentUser: boolean) => {
  const textColor = isCurrentUser ? 'text-white' : 'text-black1';
  if (!content) {
    return '';
  }
  let replacedText;

  //URLs starting with http://, https://, or ftp://
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = content.replace(replacePattern1, `<a class=\'message-content-link ${textColor} underline break-all\' href="$1" target="_blank">$1</a>`);

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, `$1<a class=\'message-content-link ${textColor} underline break-all\' href="http://$2" target="_blank">$2</a>`);

  //Change email addresses to mailto:: links.
  const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(replacePattern3, `<a class=\'message-content-link ${textColor} underline break-all\' href="mailto:$1">$1</a>`);

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
    passwordLogin: yup.string().required('error.password_required'),
  };

  // Convert string array to key and get value from fieldsValidate
  const validate = arrFields.reduce((accumulator, value) => {
    return { ...accumulator, [value]: fieldsValidate[value] };
  }, {});

  return yup.object(validate).required();
};

export const showToast = (message: string) => toast(message);

// Auth 
export const setToken = (token: string) => {
  localStorage.setItem('ACCESS-TOKEN', token);
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem('REFRESH-TOKEN', token);
};

export const removeToken = () => {
  localStorage.removeItem('ACCESS-TOKEN');
};

export const getToken = () => localStorage.getItem('ACCESS-TOKEN');

export const getRefreshToken = () => localStorage.getItem('REFRESH-TOKEN') || '';

// time
export const timeSince = (date: string) => {
  const { t } = i18n;
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  let interval = seconds / 31536000;
  interval = seconds / 2592000;
  if (interval > 1) {
    const datetime = new Date(date);
    const day = datetime.getDate();
    const month = datetime.getMonth() + 1; // Tháng trong JavaScript đếm từ 0
    const year = datetime.getFullYear();
    return `${day}/${month}/${year}`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const time = Math.floor(interval);
    return t(`format_time.day${time > 1 ? 's' : ''}`, { day: time });
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const time = Math.floor(interval);
    return t(`format_time.hour${time > 1 ? 's' : ''}`, { hour: time });
  }
  interval = seconds / 60;
  if (interval > 1) {
    const time = Math.floor(interval);
    return t(`format_time.minute${time > 1 ? 's' : ''}`, { minute: time });
  }
  return t('format_time.now');
};

export const formatTimeToHHMM = (dateTime: string) => {
  const date = new Date(dateTime);
  // Get hours and minutes from the Date object
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
};

export const isOnlyEmoji = (inputString: string) => {
  const emojiRegex = /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u;
  return emojiRegex.test(inputString);
};

export const areTimeMessageOnSameDay = (time1: string, time2: string) => {
  if (!time1 || !time2) {
    return false;
  }
  // Create Date objects from the Unix timestamps
  const date1 = new Date(time1);
  const date2 = new Date(time2);

  // Compare the year, month, and day components of the two dates
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const formatDate = (time: string) => {
  if (!time) {
    return;
  }

  const { t } = i18n;
  const currentDate = new Date();
  const inputDate = new Date(time);

  // Check if the date is today
  if (
    currentDate.getDate() === inputDate.getDate() &&
    currentDate.getMonth() === inputDate.getMonth() &&
    currentDate.getFullYear() === inputDate.getFullYear()
  ) {
    return t('format_time.today');
  }

  // Calculate the date for yesterday
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  // Check if the date is yesterday
  if (
    yesterday.getDate() === inputDate.getDate() &&
    yesterday.getMonth() === inputDate.getMonth() &&
    yesterday.getFullYear() === inputDate.getFullYear()
  ) {
    return t('format_time.yesterday');
  }

  // If it's not today or yesterday, format it as "dd/mm/yyyy"
  const day = String(inputDate.getDate()).padStart(2, '0');
  const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1
  const year = inputDate.getFullYear();

  return `${day}/${month}/${year}`;
};

export const isTimeDifferenceGreaterThan5Minutes = (time1: string, time2: string) => {
  const time5Minutes = 300000;

  // Calculate the time difference in seconds
  const timeDifference = new Date(time1).getTime() - new Date(time2).getTime();
  console.log({timeDifference})

  // Check if the time difference is greater than or equal to 5 minutes (300 seconds)
  return timeDifference >= time5Minutes;
};
