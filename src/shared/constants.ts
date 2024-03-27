export const BASE_URL = 'http://103.20.103.195:4000';
export const API_DOMAIN = `${BASE_URL}/api/`;

export const VALIDATE_LENGTH = {
  MIN_LENGTH: 6,
  MAX_NAME: 30,
  MAX_PASSWORD: 32,
  MAX_EMAIL: 128,
  LIMIT_IMAGES: 4,
};

export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export const REACTIONS: {
  [key: number]: {
    text: string;
    value: number;
  }
} = {
  1: {
    text: '👍',
    value: 1,
  },
  2: {
    text: '❤️',
    value: 2,
  },
  3: {
    text: '🤣',
    value: 3,
  },
  4: {
    text: '😥',
    value: 4,
  },
  5: {
    text: '😮',
    value: 5,
  },
  6: {
    text: '😡',
    value: 6,
  },
};
